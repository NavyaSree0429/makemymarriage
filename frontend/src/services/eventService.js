const API_BASE_URL = 'http://localhost:5000/api/v1';

export const createEventApi = async (token, weddingId, eventData) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to create event ceremony.');
  }
  return data;
};

export const getEventsApi = async (token, weddingId) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch event ceremonies.');
  }
  return data;
};

export const updateEventApi = async (token, weddingId, eventId, eventData) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to update event ceremony.');
  }
  return data;
};

export const deleteEventApi = async (token, weddingId, eventId) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to delete event ceremony.');
  }
  return data;
};
