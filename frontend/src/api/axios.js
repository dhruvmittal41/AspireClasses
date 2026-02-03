import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");

    
    if (adminToken && config.url.startsWith("/api/admin") === false) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
export default api;