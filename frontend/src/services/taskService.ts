import { api } from "@/lib/api";

interface Task {
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  deadline?: Date;
  projectId: string;
  createdAt: Date;
}


export const taskService = {
  /**
   * Fetch paginated and filtered tasks for a project.
   * @param {string} projectId - The project ID.
   * @param {number} page - Page number.
   * @param {number} limit - Items per page.
   * @param {Object} filters - Filter options: status, priority, deadlineFrom, deadlineTo.
   * @returns {Promise<any>} - Paginated tasks data.
   */
  getPaginatedTasks: async (
    projectId: string,
    page: number,
    limit: number,
    filters: {
      status?: "todo" | "in-progress" | "done";
      priority?: "low" | "medium" | "high";
      deadlineFrom?: string;
      deadlineTo?: string;
    } = {}
  ): Promise<any> => {
    const params: Record<string, any> = {
      page,
      limit,
    };
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.deadlineFrom) params.deadlineFrom = filters.deadlineFrom;
    if (filters.deadlineTo) params.deadlineTo = filters.deadlineTo;
    const response = await api.get(`/tasks/${projectId}`, { params });
    return response.data;
  },
  createTask: async (taskData: Task) => {
    const response = await api.post("/tasks", taskData);
    return response.data;
  },
  updateTask: async (taskId: string, taskData: Partial<Task>) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },
  deleteTask: async (taskId: string) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },
};
