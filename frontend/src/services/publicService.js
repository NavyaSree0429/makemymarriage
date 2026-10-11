const API_BASE_URL = 'http://localhost:5000/api/v1';

export async function getPublicWeddingApi(slug) {
  const response = await fetch(`${API_BASE_URL}/public/weddings/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Failed to load public wedding portal');
  }
  return data;
}
