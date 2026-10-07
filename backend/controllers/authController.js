const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const {
  generateTokens,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require('../utils/jwt');

// Helper to check if Mongoose DB connection is active
const isDBConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// In-Memory Fallback Storage Helper
const getMemoryUsers = () => {
  if (!global.memoryUsers) global.memoryUsers = [];
  return global.memoryUsers;
};

/**
 * Register a new User Account
 * POST /api/v1/auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const { fullName, email, password, phone } = req.body;
    const cleanEmail = email.toLowerCase();

    if (isDBConnected()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return sendError(res, 409, 'An account with this email address already exists.', 'EMAIL_EXISTS');
      }

      const user = await User.create({
        fullName,
        email: cleanEmail,
        password,
        phone: phone || '',
      });

      const { accessToken, refreshToken } = generateTokens(user);
      setRefreshTokenCookie(res, refreshToken);

      return sendSuccess(res, 201, 'User account registered successfully', {
        user: user.toSafeObject(),
        accessToken,
      });
    } else {
      // Memory Fallback
      const users = getMemoryUsers();
      if (users.find(u => u.email === cleanEmail)) {
        return sendError(res, 409, 'An account with this email address already exists.', 'EMAIL_EXISTS');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const memUser = {
        _id: `mem_user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        fullName,
        email: cleanEmail,
        password: hashedPassword,
        phone: phone || '',
        profilePicture: '',
        isEmailVerified: true,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        toSafeObject: function () {
          const { password, ...safe } = this;
          return safe;
        }
      };

      users.push(memUser);

      const { accessToken, refreshToken } = generateTokens(memUser);
      setRefreshTokenCookie(res, refreshToken);

      return sendSuccess(res, 201, 'User account registered successfully (Dev Memory Mode)', {
        user: memUser.toSafeObject(),
        accessToken,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate User Credentials & Issue Tokens
 * POST /api/v1/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase();

    if (isDBConnected()) {
      const user = await User.findOne({ email: cleanEmail }).select('+password');
      if (!user) {
        return sendError(res, 401, 'Invalid email or password credentials.', 'INVALID_CREDENTIALS');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return sendError(res, 401, 'Invalid email or password credentials.', 'INVALID_CREDENTIALS');
      }

      if (user.status !== 'ACTIVE') {
        return sendError(res, 403, 'User account is suspended or inactive.', 'ACCOUNT_DISABLED');
      }

      const { accessToken, refreshToken } = generateTokens(user);
      setRefreshTokenCookie(res, refreshToken);

      return sendSuccess(res, 200, 'Authenticated successfully', {
        user: user.toSafeObject(),
        accessToken,
      });
    } else {
      // Memory Fallback
      const users = getMemoryUsers();
      const user = users.find(u => u.email === cleanEmail);
      if (!user) {
        return sendError(res, 401, 'Invalid email or password credentials.', 'INVALID_CREDENTIALS');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return sendError(res, 401, 'Invalid email or password credentials.', 'INVALID_CREDENTIALS');
      }

      const { accessToken, refreshToken } = generateTokens(user);
      setRefreshTokenCookie(res, refreshToken);

      return sendSuccess(res, 200, 'Authenticated successfully (Dev Memory Mode)', {
        user: user.toSafeObject(),
        accessToken,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh Access Token using HTTP-only Refresh Token Cookie
 * POST /api/v1/auth/refresh-token
 */
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return sendError(res, 401, 'Refresh token required', 'REFRESH_TOKEN_MISSING');
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      clearRefreshTokenCookie(res);
      return sendError(res, 401, 'Invalid or expired refresh token', 'REFRESH_TOKEN_EXPIRED');
    }

    let user;
    if (isDBConnected()) {
      user = await User.findById(decoded.userId);
    } else {
      user = getMemoryUsers().find(u => u._id === decoded.userId);
    }

    if (!user || user.status !== 'ACTIVE') {
      clearRefreshTokenCookie(res);
      return sendError(res, 401, 'User account not found', 'UNAUTHORIZED');
    }

    const safeUser = user.toSafeObject ? user.toSafeObject() : user;
    const tokens = generateTokens(user);
    setRefreshTokenCookie(res, tokens.refreshToken);

    return sendSuccess(res, 200, 'Token refreshed successfully', {
      user: safeUser,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout User & Clear Refresh Cookie
 * POST /api/v1/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    clearRefreshTokenCookie(res);
    return sendSuccess(res, 200, 'Logged out successfully', null);
  } catch (error) {
    next(error);
  }
};

/**
 * Request Password Reset OTP
 * POST /api/v1/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const cleanEmail = email.toLowerCase();
    
    let user;
    if (isDBConnected()) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = getMemoryUsers().find(u => u.email === cleanEmail);
    }

    if (!user) {
      return sendSuccess(res, 200, 'If an account exists, a password reset OTP has been sent.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = expires;
    
    if (isDBConnected()) {
      await user.save();
    }

    console.log(`[MOCK EMAIL / OTP] Password reset OTP for ${user.email}: ${otp}`);

    return sendSuccess(res, 200, 'Password reset OTP generated', {
      email: user.email,
      ...(process.env.NODE_ENV === 'development' ? { devOtp: otp } : {})
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP & Reset Password
 * POST /api/v1/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const cleanEmail = email.toLowerCase();

    let user;
    if (isDBConnected()) {
      user = await User.findOne({
        email: cleanEmail,
        resetPasswordExpires: { $gt: Date.now() },
      }).select('+resetPasswordOTP +resetPasswordExpires');
    } else {
      user = getMemoryUsers().find(u => u.email === cleanEmail);
    }

    if (!user || user.resetPasswordOTP !== otp) {
      return sendError(res, 400, 'Invalid or expired OTP.', 'INVALID_OTP');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = isDBConnected() ? newPassword : await bcrypt.hash(newPassword, salt);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    if (isDBConnected()) {
      await user.save();
    }

    return sendSuccess(res, 200, 'Password reset successfully. You can now log in.');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current Logged-in User Profile
 * GET /api/v1/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const safeUser = req.user.toSafeObject ? req.user.toSafeObject() : req.user;
    return sendSuccess(res, 200, 'Current user profile retrieved', {
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Profile Details
 * PUT /api/v1/auth/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, profilePicture } = req.body;
    const user = req.user;

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    if (isDBConnected() && typeof user.save === 'function') {
      await user.save();
    }

    const safeUser = user.toSafeObject ? user.toSafeObject() : user;
    return sendSuccess(res, 200, 'Profile updated successfully', {
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
};
