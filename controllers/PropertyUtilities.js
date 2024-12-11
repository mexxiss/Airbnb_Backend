import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { PropertyUtilitiesModel } from "../models/PropertyUtilities.js";
import mongoose from "mongoose";

export const SetPropertyUtility = async(req, res, next) => {
    const {name, provider_name, account_no, paid_by, web_login, web_pass, link, uploads, property, already_have_account} = req.body;
    
    if(!property || !mongoose.isValidObjectId(property)) {
        return next(new apiError(400, `Property Id is required`));
    }

    try {
        const utilities = await PropertyUtilitiesModel.create({name, provider_name, account_no, paid_by, web_login, web_pass, link, uploads, property, already_have_account});
        return res.status(200).json(new apiResponse(200, utilities, "Property Utility Created Successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const GetPropertyUtilities = async (req, res, next) => {
    const {property} = req.query || req.params;
    const user_id = req._id;
    
    if( !user_id ) {
        return next(new apiError(400, `User required`));
    }

    if ( !property ) {
        return next(new apiError(400, `Query or Param not received for Property`));
    }

    try {
        const utilities = await PropertyUtilitiesModel.find({property});
        return res.status(200).json({utilities});
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}

export const UpdatePropertyUtility = async (req, res, next) => {
    const {id} = req.params || req.query;
    const user_id = req._id;
    const {updates} = req.body;

    if (!updates) {
        return next(new apiError(400, `Property Utility Update required`));
    }
    if( !user_id ) {
        return next(new apiError(400, `User required`));
    }

    try {
        const doc = await PropertyUtilitiesModel.findByIdAndUpdate( id, {$set: updates}, { new: true, runValidators: true });

        if (!doc) {
            return next(new apiError(404, `Property Utility not found`));
        }
        return res.status(200).json(doc);
    } catch (error) {
        console.error(`Error updating Property Utility: ${error.message}`);
        return next(new apiError(500, `Server Error`));
    }
}