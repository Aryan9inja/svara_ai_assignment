import * as taskService from "../services/task.js";

const addTask = (req, res, next) => {
  try {
    taskService.addTask(req, res);
  } catch (error) {
    next(error);
  }
};

const editTask = (req, res, next) => {
  try {
    taskService.editTask(req, res);
  } catch (error) {
    next(error);
  }
};

const deleteTask = (req, res, next) => {
  try {
    taskService.deleteTask(req, res);
  } catch (error) {
    next(error);
  }
};

const getTasks = (req, res, next) => {
  try {
    taskService.getPaginatedTasks(req, res);
  } catch (error) {
    next(error);
  }
};

export { addTask, editTask, deleteTask, getTasks };
