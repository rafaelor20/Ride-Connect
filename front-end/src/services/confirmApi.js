import api from './api';

export async function confirm( body, token) {
  const response = await api.post('/ride/confirm', body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
