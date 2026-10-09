const API_BASE_URL = 'http://localhost:5000/api/v1';

export const createVendorApi = async (token, weddingId, vendorData) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/vendors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(vendorData),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to add vendor record.');
  }
  return data;
};

export const getVendorsApi = async (token, weddingId) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/vendors`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch vendor directory.');
  }
  return data;
};

export const updateVendorApi = async (token, weddingId, vendorId, vendorData) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/vendors/${vendorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(vendorData),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to update vendor record.');
  }
  return data;
};

export const deleteVendorApi = async (token, weddingId, vendorId) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/vendors/${vendorId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to delete vendor record.');
  }
  return data;
};
