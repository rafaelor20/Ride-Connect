import axios from 'axios';

const url = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const api = axios.create({
  baseURL: url
});

export default api;
