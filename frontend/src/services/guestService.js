const API_BASE_URL = 'http://localhost:5000/api/v1';

export const createGuestApi = async (token, weddingId, guestData) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/guests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(guestData),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to add guest to roster.');
  }
  return data;
};

export const getGuestsApi = async (token, weddingId) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/guests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch guest roster.');
  }
  return data;
};

export const updateGuestApi = async (token, weddingId, guestId, guestData) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/guests/${guestId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(guestData),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to update guest details.');
  }
  return data;
};

export const deleteGuestApi = async (token, weddingId, guestId) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/guests/${guestId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to remove guest from roster.');
  }
  return data;
};
