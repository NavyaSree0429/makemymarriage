import { apiRequest } from './api';

export async function getNotificationsApi(token, weddingId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `/weddings/${weddingId}/notifications${query ? `?${query}` : ''}`;
  return apiRequest(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function markNotificationsReadApi(token, weddingId, notificationId = null) {
  return apiRequest(`/weddings/${weddingId}/notifications/mark-read`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ notificationId }),
  });
}

export async function deleteNotificationApi(token, weddingId, notificationId) {
  return apiRequest(`/weddings/${weddingId}/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function clearAllNotificationsApi(token, weddingId) {
  return apiRequest(`/weddings/${weddingId}/notifications`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function sendTestNotificationApi(token, weddingId, data = {}) {
  return apiRequest(`/weddings/${weddingId}/notifications/test`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}
