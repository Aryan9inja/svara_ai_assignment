import * as authService from '../services/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  await authService.registerUser(req, res);
});

export const login = asyncHandler(async (req, res) => {
  await authService.loginUser(req, res);
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req, res);
});

export const refresh = asyncHandler(async (req, res) => {
  await authService.refreshAccessToken(req, res);
});

export const getCurrent = asyncHandler(async (req, res) => {
  await authService.getCurrentUser(req, res);
});
