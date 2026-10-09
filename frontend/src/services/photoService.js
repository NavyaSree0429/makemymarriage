const API_BASE_URL = 'http://localhost:5000/api/v1';

export async function createPhotoApi(token, weddingId, photoData) {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/photos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(photoData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Failed to upload photo');
  }
  return data;
}

export async function getPhotosApi(token, weddingId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/weddings/${weddingId}/photos${query ? `?${query}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Failed to fetch photo gallery');
  }
  return data;
}

export async function updatePhotoApi(token, weddingId, photoId, photoData) {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/photos/${photoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(photoData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Failed to update photo');
  }
  return data;
}

export async function deletePhotoApi(token, weddingId, photoId) {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/photos/${photoId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Failed to delete photo');
  }
  return data;
}

export async function toggleLikePhotoApi(token, weddingId, photoId) {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/photos/${photoId}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Failed to toggle like');
  }
  return data;
}
