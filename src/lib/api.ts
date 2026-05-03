import axios from "axios";
import { installMockAdapter } from "./mockApi";

export const API_BASE_URL = "http://localhost:8080";

// Toggle this to false when wiring up the real backend.
export const USE_MOCK = true;

const api = axios.create({
  baseURL: API_BASE_URL,
});

if (USE_MOCK) {
  installMockAdapter(api);
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export type Role = "OWNER" | "EMPLOYEE";

export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return (
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Something went wrong"
    );
  }
  return "Something went wrong";
};
