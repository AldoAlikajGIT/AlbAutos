// src/Services/api.ts
import axios, { AxiosHeaders } from "axios";

const API_BASE = "http://localhost:8080";
const API_URL = `${API_BASE}/api`;

// ✅ Create an axios instance for your backend API
const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, // adjust if you need cookies
});

// ✅ Automatically attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Normalize headers to AxiosHeaders so TypeScript doesn't complain
    const headers =
      config.headers instanceof AxiosHeaders
        ? config.headers
        : AxiosHeaders.from(config.headers || {});

    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

// ✅ Example helper functions (you can keep using api directly too)
export const getCarBrands = async () => {
  const res = await api.get("/brands");
  return res.data;
};

export const getCarModels = async (brandId: number) => {
  const res = await api.get(`/models?brandId=${brandId}`);
  return res.data;
};

export const searchCarAds = async (filters: Record<string, any>) => {
  const res = await api.get("/cars/search", { params: filters });
  return res.data;
};

export default api;
