import { apiError } from "../apiError.js";
import { apiResponse } from "../apiResponse.js";

export const signUpValidator = async (req, res, next) => {
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

    next();
}