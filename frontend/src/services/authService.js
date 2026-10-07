import { apiRequest } from './api';

export async function loginApi(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signupApi(fullName, email, password, phone) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password, phone }),
  });
}

export async function getMeApi(token) {
  return apiRequest('/auth/me', {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function refreshTokenApi() {
  return apiRequest('/auth/refresh-token', {
    method: 'POST',
  });
}

export async function logoutApi() {
  return apiRequest('/auth/logout', {
    method: 'POST',
  });
}

export async function forgotPasswordApi(email) {
  return apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordApi(email, otp, newPassword) {
  return apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp, newPassword }),
  });
}

export async function updateProfileApi(token, data) {
  return apiRequest('/auth/profile', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}
