import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { UserDocumentsModel } from "../models/UserDocuments.js";

export const SetUserDocument = async(req, res, next) => {
    const user_id = req._id;
    const {title, expiry_date, note, document, property} = req.body;

    try {
        const userdocuments = UserDocumentsModel.create({title, expiry_date, note, document, property, user: user_id});
        return res.status(200).json(new apiResponse(200, userdocuments, "Created Successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const GetUserDocuments = async (req, res, next) => {
    const {property} = req.query || req.params;
    const user_id = req._id;

    try {
        const docs = await UserDocumentsModel.find({property, user: user_id});
        return res.status(200).json({docs});
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}