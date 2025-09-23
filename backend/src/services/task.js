import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiRes.js";
import {
  createTask,
  editTaskById,
  deleteTaskById,
  getTasksByProjectIdPaginated,
} from "../repositories/task.js";

export const addTask = asyncHandler(async (req, res) => {
  let { title, status, priority, deadline, projectId } = req.body;

  title = title?.trim();
  if (!title || !projectId) {
    throw new ApiError(400, "Title and Project ID are required");
  }

  const taskData = { title, status, priority, deadline, projectId };
  const task = await createTask(taskData);
  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

export const editTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }

  const updateData = req.body;
  const updatedTask = await editTaskById(taskId, updateData);
  if (!updatedTask) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }

  const deletedTask = await deleteTaskById(taskId);
  if (!deletedTask) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedTask, "Task deleted successfully"));
});

export const getPaginatedTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const filter = {};
  const { status, priority, deadlineFrom, deadlineTo } = req.query;

  if (status) {
    filter.status = status;
  }
  if (priority) {
    filter.priority = priority;
  }
  if (deadlineFrom || deadlineTo) {
    filter.deadline = {};
    if (deadlineFrom) {
      filter.deadline.$gte = new Date(deadlineFrom);
    }
    if (deadlineTo) {
      filter.deadline.$lte = new Date(deadlineTo);
    }
  }

  const { page = 1, limit = 10 } = req.query;
  const tasks = await getTasksByProjectIdPaginated(projectId, page, limit, filter);
  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
});
