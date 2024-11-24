import api from './api';

export async function estimate( origin, destination) {
  const response = await api.post('/ride/estimate', { origin, destination });
  return response.data;
}
