import api from './api';

export async function confirm( body, token) {
  const response = await api.patch('/ride/confirm', body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
