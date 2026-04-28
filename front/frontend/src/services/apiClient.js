import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://referee-monitor-production.up.railway.app",
  timeout: 15000,
});

export default apiClient;