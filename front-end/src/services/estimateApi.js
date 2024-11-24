import api from './api';

export async function estimate( body, token) {
  const response = await api.post('/ride/estimate', body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
