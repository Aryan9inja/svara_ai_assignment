import { Router } from "express";
import {
  addTask,
  editTask,
  deleteTask,
  getTasks,
} from "../controllers/task.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// Protected routes
router.post("/", authMiddleware, addTask);
router.put("/:taskId", authMiddleware, editTask);
router.delete("/:taskId", authMiddleware, deleteTask);
router.get("/:projectId", authMiddleware, getTasks);

export default router;
