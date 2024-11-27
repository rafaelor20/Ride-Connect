import api from './api';

export async function estimate( body) {
  const response = await api.post('/ride/estimate', body);
  return response.data;
}
