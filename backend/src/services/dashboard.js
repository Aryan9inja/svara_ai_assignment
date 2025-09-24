import { getAllProjects } from "../repositories/project.js";
import {
  getTasksByProjectIds,
  getOverdueTasks,
} from "../repositories/task.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiRes.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const projects = await getAllProjects(userId);
  const projectIds = projects.map((project) => project._id);

  const taskStatusCounts = await getTasksByProjectIds(projectIds);
  const overdueTasks = await getOverdueTasks(projectIds);
  const statusCounts = { todo: 0, "in-progress": 0, done: 0 };

  taskStatusCounts.forEach((item) => {
    statusCounts[item._id] = item.count;
  });
  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalProjects: projects.length,
        taskStatusCounts: statusCounts,
        overdueTasks,
      },
      "Dashboard data fetched successfully"
    )
  );
});
