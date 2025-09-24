import { api } from "@/lib/api";

export const authService = {
  signUp: (data: { email: string; password: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
  refreshToken: () => api.post("/auth/refresh"),
};
