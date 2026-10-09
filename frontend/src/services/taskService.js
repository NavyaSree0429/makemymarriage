const API_BASE_URL = 'http://localhost:5000/api/v1';

export const createTaskApi = async (token, weddingId, taskData) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to create task.');
  }
  return data;
};

export const getTasksApi = async (token, weddingId) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch tasks.');
  }
  return data;
};

export const updateTaskApi = async (token, weddingId, taskId, taskData) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to update task.');
  }
  return data;
};

export const deleteTaskApi = async (token, weddingId, taskId) => {
  const response = await fetch(`${API_BASE_URL}/weddings/${weddingId}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to delete task.');
  }
  return data;
};
