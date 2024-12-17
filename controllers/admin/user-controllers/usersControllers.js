import { UserModel } from "../../../models/Users.js";

const getAllUsers = async (req, res) => {
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

const getUserById = async (req, res) => {
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

const softDeleteUserById = async (req, res) => {
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

const updateUserById = async (req, res) => {
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

export { getAllUsers, getUserById, softDeleteUserById, updateUserById };
