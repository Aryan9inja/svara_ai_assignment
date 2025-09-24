import task from "../models/task.js";
import Task from "../models/task.js";

export const createTask = async (taskData) => {
  const task = new Task(taskData);
  return await task.save();
};

export const editTaskById = async (taskId, updateData) => {
  return await Task.findOneAndUpdate({ _id: taskId }, updateData, {
    new: true,
  });
};

export const deleteTaskById = async (taskId) => {
  return await Task.findOneAndDelete({ _id: taskId });
};

export const getTasksByProjectIdPaginated = async (
  projectId,
  page,
  limit,
  filter = {}
) => {
  const skip = (page - 1) * limit;
  const query = { projectId, ...filter };
  return await Task.find(query).skip(skip).limit(limit);
};

export const getTasksByProjectIds = async (projectIds) => {
  return task.aggregate([
    { $match: { projectId: { $in: projectIds } } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
};

export const getOverdueTasks = async (projectIds) => {
  const now = new Date();
  return await Task.find({
    projectId: { $in: projectIds },
    deadline: { $lt: now },
    status: { $ne: "done" },
  }).select("title deadline projectId");
};
