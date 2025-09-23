import Project from "../models/project.js";

export const createProject = async (projectData) => {
  const project = new Project(projectData);
  return await project.save();
};

export const getAllProjects = async (userId) => {
  return await Project.find({ userId });
};

export const deleteProjectById = async (projectId, userId) => {
  return await Project.findOneAndDelete({ _id: projectId, userId });
};
