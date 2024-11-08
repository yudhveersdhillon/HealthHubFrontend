import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://your-api-endpoint.com', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
