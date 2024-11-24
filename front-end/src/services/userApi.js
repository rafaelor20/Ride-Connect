import api from './api';

export async function signUp(name, email, password) {
  const response = await api.post('/users', { name, email, password });
  return response.data;
}
