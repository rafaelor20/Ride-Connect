import api from './api';

export async function confirm( origin, destination, distance, duration, driver, value) {
  const response = await api.post('/ride/confirm', { origin, destination, distance, duration, driver, value });
  return response.data;
}
