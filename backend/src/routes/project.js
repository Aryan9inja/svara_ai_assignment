import { Router } from "express";
import * as projectController from "../controllers/project.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// Private routes
router.post("/", authMiddleware, projectController.createProject);
router.get("/", authMiddleware, projectController.getAllProjects);
router.delete("/:id", authMiddleware, projectController.deleteProject);

export default router;
