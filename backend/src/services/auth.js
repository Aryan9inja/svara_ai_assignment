import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { findByEmail } from "../repositories/user.js";
import { findByIdWithoutSensitiveInfo } from "../repositories/user.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiRes.js";
import { createUser } from "../repositories/user.js";
import { updateUser } from "../repositories/user.js";
import { findById } from "../repositories/user.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await findByIdWithoutSensitiveInfo(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(409, "All fields are required");
  }

  const existingUser = await findByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await createUser({ email, password });
  if (!user || !user._id) {
    throw new ApiError(500, "Failed to create user");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  res
    .status(201)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          user: userObj,
          accessToken,
        },
        "User registered successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  email = email?.trim();
  password = password?.trim();

  if (!email || !password) {
    throw new ApiError(409, "All fields are required");
  }

  const user = await findByEmail(email);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isValidPassword(password);
  if (!isPasswordValid) throw new ApiError(401, "Password is incorrect");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id.toString()
  );

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: userObj,
          accessToken,
        },
        "Login successfull"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Not authenticated");

  await updateUser(req.user._id, { refreshToken: undefined });

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "Missing refresh token");

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await findById(decoded.id);
  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(403, "Invalid refresh token");
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(user._id.toString());

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");

  const { _id, email } = user;
  res
    .status(200)
    .json(
      new ApiResponse(200, { user: { _id, email } }, "Current user fetched")
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
};
