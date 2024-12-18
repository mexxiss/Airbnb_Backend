import { UserModel } from "../../../models/Users.js";
import { generatePassword } from "../../../utils/generatePassword.js";
import { mailSender } from "../../../utils/mailSender.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const SignUp = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "Admin can create login credentials for Property Owner by sending details and AUTHORIZED BEARER TOKEN in header. On creation, password string will be shared to admin and Property Owner through Emails."
  /* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/SignUpRequest"
          }  
        }
      }
    } 
  */
  const { first_name, last_name, email, phone, role, address } = req.body;

  try {
    const user = await UserModel.findOne({ email: { $in: email } });
    if (user) {
      return next(new apiError(400, "User already exists"));
    }
    const password = generatePassword();
    const newUser = await UserModel.create({ first_name, last_name, email, password, phone, role, address });

    const replacements = {
      title: "Welcome On-board",
      text: `Welcome to Property Management! We’re excited to have you on board. Below are your login credentials to access your account and manage your properties efficiently.`,
      moreDetails: `<div class="credentials">
            <p>Email: ${email[0]}</p>
            <p>Password: ${password}</p>
        </div>
        <p>We recommend changing your password after your first login for security purposes.</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team at ${process.env.MAIL_FROM}.</p>
        <p>Thank you for choosing ${Mexxiss}. We look forward to serving you!</p>`,
    };

    const adminReplacements = {
      title: "Credentials Generated",
      text: `This is to confirm that the login credentials for Mexxiss have been successfully generated for the user [User's Name]. Below are the details:`,
      moreDetails: `div class="details">
            <p><strong>User Details:</strong></p>
            <p>Name: ${first_name} ${last_name}</p>
            <p>Email: ${email[0]}</p>
            <p><strong>Account Details:</strong></p>
            <p>Generated Password: ${password}</p>
        </div>
        <p>Please ensure that the user is informed of these credentials securely. You can share the credentials with the user via email or any secure communication channel.</p>
        <p>If you did not initiate this action or need assistance, please contact our support team immediately at ${process.env.MAIL_FROM}.</p>
        <p>Thank you for managing the user accounts efficiently!</p>`,
    };

    await Promise.all([
      mailSender(process.env.MAIL_FROM, `Login Credentials Successfully Generated for ${first_name}`, adminReplacements),
      mailSender(email[0], "Welcome On-board", replacements),
    ]);
    return res.status(201).json(new apiResponse(201, newUser._id, "User created Successfully"));
  } catch (error) {
    console.log(error);
    return next(new apiError(500, error.message || "Internal server error"));
  }
};

export const getAllUsers = async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "Admin can view the list of users by passing AUTHORIZED BEARER TOKEN in header and query parameters - limit and page"

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
  // #swagger.summary = "Admin can view the details of the user passing its ID inside path and AUTHORIZED BEARER TOKEN in header."

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
  // #swagger.summary = "Admin can disable the user, by passing the AUTHORIZED BEARER TOKEN in header and user ID in path, from utilizing the property management platform."
  // #swagger.description = "> #TODO: Response might be unnecessarily long",

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
  // #swagger.summary = "Admin can update the user details by passing AUTHORIZED BEARER TOKEN in header and user ID in path"

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