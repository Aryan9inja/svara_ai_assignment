import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/", authMiddleware, dashboardController.getDashboardData);

export default router;
