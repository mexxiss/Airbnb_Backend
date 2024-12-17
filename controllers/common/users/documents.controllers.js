import { apiResponse } from "../../../utils/apiResponse.js";
import { apiError } from "../../../utils/apiError.js";
import { UserDocumentsModel } from "../../../models/UserDocuments.js";

export const SetUserDocument = async(req, res, next) => {
    // #swagger.tags = ['Users']
    const user_id = req._id;
    const {title, expiry_date, note, document, property} = req.body;
    
    if( !user_id ) {
        return next(new apiError(400, `User required`));
    }

    try {
        const userdocuments = await UserDocumentsModel.create({title, expiry_date, note, document, property, user: user_id});
        return res.status(200).json(new apiResponse(200, userdocuments, "Created Successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const GetUserDocuments = async (req, res, next) => {
    // #swagger.tags = ['Users']
    const {property} = req.query || req.params;S
    const user_id = req._id;
    
    if( !user_id ) {
        return next(new apiError(400, `User required`));
    }

    try {
        const docs = await UserDocumentsModel.find({property, user: user_id});
        return res.status(200).json({docs});
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}

export const UpdateUserDocuments = async (req, res, next) => {
    // #swagger.tags = ['Users']
    const {id} = req.params || req.query;
    const user_id = req._id;
    const {updates} = req.body;

    if (!updates) {
        return next(new apiError(400, `Payment Details Update required`));
    }
    if( !user_id ) {
        return next(new apiError(400, `User required`));
    }

    try {
        const doc = await UserDocumentsModel.findOne({ _id: id });

        if (!doc) {
            return next(new apiError(404, `Payment Details not found`));
        }

        if (user_id !== doc.user.toString()) {
            return next(new apiError(403, `Not Authorized to change details`));
        }

        doc.set(updates);
        await doc.save({ validateBeforeSave: true });

        return res.status(200).json(doc);
    } catch (error) {
        console.error(`Error updating payment details: ${error.message}`);
        return next(new apiError(500, `Server Error`));
    }
}