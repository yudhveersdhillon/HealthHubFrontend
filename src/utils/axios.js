import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://3.110.108.239:8080/api/v1/', 
  headers: {},
});
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user?.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosInstance;
