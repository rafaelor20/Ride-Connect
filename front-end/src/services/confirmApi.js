import api from './api';

export async function confirm( body) {
  const response = await api.patch('/ride/confirm', body);
  return response.data;
}
