import api from './api';

export async function getRides(body, token) {
  let { driver_id } = body;
  const url = driver_id ? `/ride/?driver_id=${driver_id}` : '/ride';
  
  const response = await api.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
