const { UserModel } = require("../models/Users");

// Role-based middleware
const roleAuthorization = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Assuming userId is available from a verified token in req.user
      const userId = req.user?.id;

      if (!userId) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User ID not found." });
      }

      // Fetch the user from the database
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Check if the user's role is in the allowedRoles
      if (!allowedRoles.includes(user.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions." });
      }

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error("Role authorization error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
};

module.exports = roleAuthorization;
