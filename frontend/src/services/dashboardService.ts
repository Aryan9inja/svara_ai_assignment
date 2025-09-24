import { api } from "@/lib/api";

export const dashboardService = {
  getData: () => api.get("/dashboard"),
};
