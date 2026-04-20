const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const client = async (endpoint, { method = 'GET', body, token } = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw {
      status: res.status,
      message: data.message || `HTTP ${res.status}`,
      ...data,
    };
  }

  if (res.status === 204) return null;

  const text = await res.text();
  if (!text || text.trim() === '') return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export default client;