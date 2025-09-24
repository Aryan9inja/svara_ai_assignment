import * as dashboardService from "../services/dashboard.js";

export const getDashboardData = async (req, res, next) => {
  try {
    dashboardService.getDashboardData(req, res);
  } catch (error) {
    next(error);
  }
};
