import { UserModel } from "../../../models/Users.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

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
