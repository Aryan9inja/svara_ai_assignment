import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { findByIdWithoutSensitiveInfo } from "../repositories/user.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const userId = decoded.id;
    if (!userId) {
      throw new ApiError(401, "Token payload missing user ID");
    }

    const user = await findByIdWithoutSensitiveInfo(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
