import axios from 'axios';

const api = axios.create({
  baseURL: 'http://3.110.108.239:8080/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
