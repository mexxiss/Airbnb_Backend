import { UserModel } from "../models/Users.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

import validator from "validator";
import { generatePassword } from "../utils/generatePassword.js";
import { BlacklistModel } from "../models/Blacklist.js";

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

export const Login = async (req, res, next) => {
  // #swagger.tags = ['General']
  const { email, password } = req.body;

  const requiredFields = [email, password];
  const requiredFieldsChecked = requiredFields.every((field) => {
    return field !== undefined && field !== null && field !== "";
  });

  try {
    const user = await UserModel.findOne({ email: { $in: email } });
    if (!user) {
      return next(new apiError(400, "Email is not Registered"));
    }

    if (!user.compareBcryptPassword(password)) {
      return next(new apiError(400, "Password is Incorrect"));
    }

    const token = await user.generateAccessToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: process.env.JWT_EXPIRY,
    });
    return res
      .status(200)
      .json(new apiResponse(200, { user }, "Login Successful"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const ChangePassword = async (req, res, next) => {
  // #swagger.tags = ['Users']
  const user_id = req._id;
  const { current_pass, new_pass } = req.body;

  try {
    const user = await UserModel.findById(user_id);
    if (!user.compareBcryptPassword(current_pass)) {
      return next(new apiError(400, "Current Password doesn't match"));
    }
    user.password = new_pass;
    await user.save();
    return res
      .status(200)
      .json(new apiResponse(200, { user }, "password changed"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const Logout = async (req, res, next) => {
  // #swagger.tags = ['Users']
  const user_id = req._id;
  const token = req.token;

  try {
    const blacklistCheck = await BlacklistModel.findOne({ token });

    if (blacklistCheck) {
      return next(new apiError(401, "Session expired"));
    }

    const blacklist = await BlacklistModel.create({ token });
    const user = await UserModel.findById(user_id);

    if (!user) {
      return next(new apiError(400, "User doesn't exist"));
    }

    await user.logout();
    res.clearCookie("token");

    return res
      .status(200)
      .json(new apiResponse(200, { user }, "Logout Successful"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const GetUser = async (req, res, next) => {
  // #swagger.tags = ['Users']
  const user_id = req._id;
  if (!user_id) {
    return next(new apiError(400, "User Id not provided"));
  }
  try {
    const user = await UserModel.findById(user_id, {
      password: 0,
      accessToken: 0,
    });

    return res.status(200).json({ user });
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const UpdateUser = async (req, res, next) => {
  // #swagger.tags = ['Users']
  const user_id = req._id;
  const { updates } = req.body;

  if (!user_id) {
    return next(new apiError(400, "User Id not provided"));
  }

  try {
    const user = await UserModel.findByIdAndUpdate(
      user_id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    return res
      .status(200)
      .json(new apiResponse(200, user, "User Updated Successfully"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};
