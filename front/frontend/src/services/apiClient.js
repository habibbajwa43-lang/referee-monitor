import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://referee-monitor-api.onrender.com",
  timeout: 15000,
});

export default apiClient;