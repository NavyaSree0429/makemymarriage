const mongoose = require('mongoose');
const User = require('../models/User');
const { verifyAccessToken } = require('../utils/jwt');
const { sendError } = require('../utils/apiResponse');

const isDBConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return sendError(res, 401, 'Authentication token required', 'UNAUTHORIZED');
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return sendError(res, 401, 'Invalid or expired access token', 'TOKEN_EXPIRED');
    }

    let user;
    if (isDBConnected()) {
      user = await User.findById(decoded.userId);
    } else {
      if (!global.memoryUsers) global.memoryUsers = [];
      user = global.memoryUsers.find(u => String(u._id) === String(decoded.userId));
      
      if (!user && decoded.userId) {
        // Auto-recreate dev user in memory store if nodemon restarted
        user = {
          _id: decoded.userId,
          email: decoded.email || 'dev_user@example.com',
          fullName: 'Dev User',
          role: 'COUPLE',
          status: 'ACTIVE',
        };
        global.memoryUsers.push(user);
      }
    }

    if (!user || user.status !== 'ACTIVE') {
      return sendError(res, 401, 'User account not found or inactive', 'UNAUTHORIZED');
    }

    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded) {
        let user;
        if (isDBConnected()) {
          user = await User.findById(decoded.userId);
        } else {
          const memoryUsers = global.memoryUsers || [];
          user = memoryUsers.find(u => u._id === decoded.userId);
        }
        if (user && user.status === 'ACTIVE') {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  protect,
  optionalAuth,
};
