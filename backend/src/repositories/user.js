import User from "../models/user.js";

export const findByIdWithoutSensitiveInfo = async (id) => {
  return await User.findById(id).select("-password -refreshToken");
};

export const findByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

export const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
}

export const findById = async (id) => {
  return await User.findById(id);
};