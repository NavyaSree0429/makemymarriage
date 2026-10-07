import { apiRequest } from './api';

export async function createWeddingApi(token, data) {
  return apiRequest('/weddings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function getMyWeddingsApi(token) {
  return apiRequest('/weddings/my-weddings', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getWeddingByIdApi(token, id) {
  return apiRequest(`/weddings/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function invitePartnerApi(token, id) {
  return apiRequest(`/weddings/${id}/invite-partner`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function acceptPartnerInviteApi(token, inviteCode) {
  return apiRequest('/weddings/accept-partner-invite', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ inviteCode }),
  });
}
