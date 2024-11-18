import { PassResetModel } from "../models/PassReset.js";
import { UserModel } from "../models/Users.js";
import { apiError } from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js"

export const SetPassReset = async (req, res, next) => {
    const {email} = req.body;

    if(!email) {
        return next(new apiError(400, "Email is required"));
    }

    try {
        const user = await UserModel.findOne({email});
        if(!user) {
            return next(new apiError(400, "User is not registered"));
        }

        const passResetDoc = await PassResetModel.create({user});
        return res.status(200).json(new apiResponse(200, passResetDoc, "Reset Token generated successfully"));
    } catch (error) {
        // console.log(error);
        return next(new apiError(500, "Something went wrong"));
    }
}

export const SetNewPassword = async (req, res, next) => {
    const doc_id = req._id;
    const {password} = req.body;

    try {
        const doc = await PassResetModel.findById(doc_id);
        if(!doc) {
            return next(new apiError(400, "Password Reset Url expired"));
        } 
        const user = await doc.changeUserPassword(password);
        
        return res.status(200).json(new apiResponse(200, user, "Password Changed"));
    } catch (error) {
        return next(new apiError(500, `Something went Wrong: ${error.message}`));
    }
}