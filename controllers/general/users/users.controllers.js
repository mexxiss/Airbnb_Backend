import { OtpModel } from "../../../models/Otp.js";
import { UserModel } from "../../../models/Users.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { mailSender } from "../../../utils/mailSender.js";

export const Login = async (req, res, next) => {
  // #swagger.tags = ['General']
  // #swagger.summary = "Login User"

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

export const ForgotPassword = async (req, res, next) => {
  // #swagger.tags = ['General']
  // #swagger.summary = "Send OTP to User's Email"
  /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: "#/components/schema/OTPRequest" }
        }
      }
    }
  */
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email: { $in: email } });
    if (!user) {
      return next(new apiError(404, "User not found"));
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await OtpModel.findOneAndUpdate(
      { email },
      { otp, expiry },
      { upsert: true, new: true }
    );

    const replacements = {
      title: "OTP Verification",
      text: `Please use this code to proceed.`,
      moreDetails: `<p><strong>OTP:</strong> ${otp}</p>
      <p>This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>`,
    };

    await mailSender(email, "Reset Password", replacements);
    return res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
}

export const VerifyOtp = async (req, res, next) => {
  // #swagger.tags = ['General']
  // #swagger.summary = "Verify OTP for User"
  /* #swagger.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: "#/components/schema/VerifyOTPRequest" }
          }
        }
      }
    */
  const { otp, email } = req.body;
  try {
    const otpData = await OtpModel.findOne({ email, otp });
    if (!otpData) {
      return next(new apiError(400, "Invalid OTP"));
    }

    if (otpData.expiry < Date.now()) {
      return next(new apiError(400, "OTP Expired"));
    }

    return res.status(200).json({ message: "OTP Verified" });
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
}

export const ResetPassword = async (req, res, next) => {
  // #swagger.tags = ['General']
  // #swagger.summary = "Reset User's Password"
  /* #swagger.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: "#/components/schema/ResetPasswordRequest" }
          }
        }
      }
    */
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: { $in: email } });
    user.password = password;
    await user.save();
    return res
      .status(200)
      .json(new apiResponse(200, [], "password changed"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
}