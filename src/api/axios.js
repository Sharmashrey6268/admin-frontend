import axios from "axios";

const API = axios.create({
  baseURL: "https://admin-backend-f8y4.onrender.com/api",
});

// ❌ DO NOT attach token on auth routes
API.interceptors.request.use((req) => {
  if (!req.url.includes("/auth/login")) {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});

export default API;
