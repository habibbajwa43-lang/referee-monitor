import axios from "axios";

const apiClient = axios.create({
  // If VITE_API_BASE_URL is set (production), use it. Otherwise proxy handles it locally.
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 10000,
});

export default apiClient;
