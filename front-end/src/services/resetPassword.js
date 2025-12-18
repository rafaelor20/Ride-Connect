import api from './api';

export async function resetPassword( token, password ) {
  const response = await api.post('/auth/reset-password', { token, password });
  return response.data;
}