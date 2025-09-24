import { api } from "@/lib/api";
import { create } from "domain";

export const projectService = {
  getProjects: () => api.get("/projects"),
  createProject: (data: { name: string; description?: string }) =>
    api.post("/projects", data),
  deleteProject: (projectId: string) => api.delete(`/projects/${projectId}`),
};
