import { UserModel } from "../../../models/Users.js";

import validator from "validator";
import { generatePassword } from "../../../utils/generatePassword.js";

export const SignUp = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  const { first_name, last_name, email, phone, role, address } = req.body;

  const requiredFields = [first_name, last_name, email, phone, address];
  const allFieldsFilled = requiredFields.every(
    (field) => field !== undefined && field !== null && field !== ""
  );

  if (!allFieldsFilled) {
    return next(new apiError(400, "All Fields are Required"));
  }

  if (!Array.isArray(email) || email.length === 0) {
    return next(new apiError(400, "Email field must be a non-empty array"));
  }

  const invalidEmails = email.filter((e) => !validator.isEmail(e));
  if (invalidEmails.length > 0) {
    return next(
      new apiError(400, `Invalid email format for: ${invalidEmails.join(", ")}`)
    );
  }

  if (role && !["Owner", "Admin"].includes(role)) {
    return next(new apiError(400, "Invalid role"));
  }

  try {
    const user = await UserModel.findOne({ email: { $in: email } });
    if (user) {
      return next(new apiError(400, "User already exists"));
    }
    const password = generatePassword();
    console.log(password);
    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password,
      phone,
      role,
      address,
    });
    return res
      .status(201)
      .json(
        new apiResponse(201, { newUser, password }, "User created Successfully")
      );
  } catch (error) {
    console.log(error);
    return next(new apiError(500, error.message || "Internal server error"));
  }
};

export const getAllUsers = async (req, res) => {
  // #swagger.tags = ['Admin']
  const { page = 1, limit = 10 } = req.query;

  try {
    const adminId = req?.user?.id;
    const users = await UserModel.find({ _id: { $ne: adminId } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("-password -accessToken");

    const totalUsers = await UserModel.countDocuments({
      _id: { $ne: adminId },
    });

    res.status(200).json({
      data: users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  // #swagger.tags = ['Admin']
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id).select("-password -accessToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: error.message });
  }
};

export const softDeleteUserById = async (req, res) => {
  // #swagger.tags = ['Admin']
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isDeleted = !user.isDeleted;
    await user.save();

    res.status(200).json({
      message: `User ${user.isDeleted ? "In-Active" : "Active"} Successfully`,
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to toggle user status", error: error.message });
  }
};

export const updateUserById = async (req, res) => {
  // #swagger.tags = ['Admin']
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -accessToken");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};