import api from './api';

export async function getRides(body) {
  let { driver_id } = body;
  const url = driver_id ? `/ride/?driver_id=${driver_id}` : '/ride';
  
  const response = await api.get(url);
  return response.data;
}
