import * as authService from '../services/auth.js';

export const register = async (req, res, next) => {
  try {
    authService.registerUser(req, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    authService.loginUser(req, res);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    authService.logoutUser(req, res);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    authService.refreshAccessToken(req, res);
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    authService.getCurrentUser(req, res);
  } catch (error) {
    next(error);
  }
};
