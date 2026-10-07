import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginApi,
  signupApi,
  getMeApi,
  refreshTokenApi,
  logoutApi,
  updateProfileApi,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('access_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session on load
  useEffect(() => {
    async function restoreSession() {
      try {
        if (accessToken) {
          const res = await getMeApi(accessToken);
          setUser(res.data.user);
        } else {
          // Attempt refresh cookie
          const refRes = await refreshTokenApi();
          if (refRes.data?.accessToken) {
            setAccessToken(refRes.data.accessToken);
            localStorage.setItem('access_token', refRes.data.accessToken);
            setUser(refRes.data.user);
          }
        }
      } catch (err) {
        // Clear invalid token
        localStorage.removeItem('access_token');
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await loginApi(email, password);
      const token = res.data.accessToken;
      const userData = res.data.user;
      setAccessToken(token);
      localStorage.setItem('access_token', token);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signup = async (fullName, email, password, phone) => {
    setError(null);
    try {
      const res = await signupApi(fullName, email, password, phone);
      const token = res.data.accessToken;
      const userData = res.data.user;
      setAccessToken(token);
      localStorage.setItem('access_token', token);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      // Ignore
    } finally {
      localStorage.removeItem('access_token');
      setAccessToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await updateProfileApi(accessToken, profileData);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        error,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
