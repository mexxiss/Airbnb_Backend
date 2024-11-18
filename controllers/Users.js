import { UserModel } from "../models/Users.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const SignUp = async (req, res, next) => {
    const { fullname, email, password, confirmPassword } = req.body;

    const requiredFields = [fullname, email, password, confirmPassword];
    const allFieldsFilled = requiredFields.every(field => {
        return field !== undefined && field !== null && field !== ""
    });
    
    if (!allFieldsFilled) {
        return next(new apiError(400, "All Fields are Required"));
    }
    if (password !== confirmPassword) {
        return next(new apiError(400, "Password has not been confirmed"));
    }

    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            return next(new apiError(400, "User already exists"));
        }

        const newUser = await UserModel.create({ fullname, email, password });
        res.status(201).json(new apiResponse(201, newUser, "User created Successfully"));
    } catch (error) {
        console.log(error);
        next(new apiError(500, error));
    }
}

export const Login = async(req, res, next) => {
    const {email, password} = req.body;

    const requiredFields = [email, password];
    const requiredFieldsChecked = requiredFields.every(field => {
        return field !== undefined && field !== null && field !== ""
    });

    try {
        const user = await UserModel.findOne({email});
        if (!user) {
            return next(new apiError(400, "Email is not Registered"));
        }

        if(!user.compareBcryptPassword(password)) {
            return next(new apiError(400, "Password is Incorrect"));
        }

        const token = await user.generateAccessToken();
        res.status(200).json(new apiResponse(200, {user, token},"Login Successful"));
    } catch (error) {
        return next(new apiError(500, "Server Error"))
    }
}

export const Logout = async (req, res, next) => {
    const user_id = req._id;

    try {
        const user = await UserModel.findById(user_id);
        await user.logout();
        return res.status(200).json(new apiResponse(200, {user}, "Logout Successful"));
    } catch (error) {
        return next(new apiError(500, "Server Error"));
    }
}