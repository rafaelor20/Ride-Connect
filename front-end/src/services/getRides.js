import api from './api';

export async function getRides(body) {
  console.log(body);
  let { customer_id, driver_id } = body;
  const url = driver_id ? `/ride/${customer_id}?driver_id=${driver_id}` : `/ride/${customer_id}`;
  
  const response = await api.get(url);
  return response.data;
}
