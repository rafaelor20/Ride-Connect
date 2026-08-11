import api from './api';

export async function getRides(body = {}, token) {
  const query = new URLSearchParams();
  if (body.driver_id) query.append('driver_id', body.driver_id);
  if (body.date) query.append('date', body.date);
  if (body.start_date) query.append('start_date', body.start_date);
  if (body.end_date) query.append('end_date', body.end_date);

  const queryString = query.toString();
  const url = queryString ? `/ride?${queryString}` : '/ride';
  
  const response = await api.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

