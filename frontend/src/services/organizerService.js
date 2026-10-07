import { apiRequest } from './api';

export async function inviteOrganizerApi(token, weddingId, data) {
  return apiRequest(`/weddings/${weddingId}/invite-organizer`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function getOrganizersApi(token, weddingId) {
  return apiRequest(`/weddings/${weddingId}/organizers`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateOrganizerPermissionsApi(token, weddingId, membershipId, permissions) {
  return apiRequest(`/weddings/${weddingId}/organizers/${membershipId}/permissions`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ permissions }),
  });
}

export async function revokeOrganizerApi(token, weddingId, membershipId) {
  return apiRequest(`/weddings/${weddingId}/organizers/${membershipId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
