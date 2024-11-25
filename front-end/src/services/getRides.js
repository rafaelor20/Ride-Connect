import api from './api';

export async function getRides(body, token) {
  const { customer_id, driver_id } = body;
  const url = driver_id ? `/ride/${customer_id}?driver_id=${driver_id}` : `/ride/${customer_id}`;
  
  const response = await api.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
