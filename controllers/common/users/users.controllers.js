import { UserModel } from "../../../models/Users.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { BlacklistModel } from "../../../models/Blacklist.js";
import { mailSender } from "../../../utils/mailSender.js";

export const ChangePassword = async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = "AUTHENTICATED Owner OR Admin can Change Password"

  const user_id = req?.user?.id;
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
      .json(new apiResponse(200, [], "password changed"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const Logout = async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = "Logout User and Blacklist Token for Security Purposes"

  const user_id = req?.user?.id;
  const token = req.user?.token;
  
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
      .json(new apiResponse(200, "", "Logout Successful"));
  } catch (error) {
    return next(new apiError(500, `Logout Server Error: ${error}`));
  }
};

export const GetUser = async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = "AUTHENTICATED Owner OR Admin to get its Details by ID from JWT Token."

  const user_id = req?.user?.id;
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
  // #swagger.summary = "AUTHENTICATED Owner OR Admin to Update its Details by ID from JWT Token."
  
  const user_id = req?.user?.id;
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
