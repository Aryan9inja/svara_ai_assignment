import * as projectService from "../services/project.js";

export const createProject = async (req, res, next) => {
  try {
    projectService.newProject(req, res);
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req, res, next) => {
  try {
    projectService.allProjects(req, res);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    projectService.deleteProject(req, res);
  } catch (error) {
    next(error);
  }
};
