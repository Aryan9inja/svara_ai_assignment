import { asyncHandler } from "../utils/asyncHandler.js";
import { createProject } from "../repositories/project.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiRes.js";
import { getAllProjects } from "../repositories/project.js";
import { deleteProjectById } from "../repositories/project.js";

const newProject = asyncHandler(async (req, res) => {
  let { name, description } = req.body;
  name = name?.trim();
  description = description?.trim();

  if (!name) {
    throw new ApiError(400, "Project name is required");
  }
  const project = await createProject({
    name,
    description,
    userId: req.user._id,
  });

  if (!project || !project._id) {
    throw new ApiError(400, "Error creating project");
  }

  res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

const allProjects = asyncHandler(async (req, res) => {
  const projects = await getAllProjects(req.user._id);

  if (!projects) {
    throw new ApiError(404, "No projects found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  await deleteProjectById(projectId, req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Project deleted successfully"));
});

export { newProject, allProjects, deleteProject };