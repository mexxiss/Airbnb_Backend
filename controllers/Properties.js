import { PropertiesModel } from "../models/Properties.js";
import { apiError } from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";

export const GetAllProperties = async (req, res, next) => {
    try {
        const properties = await PropertiesModel.find();
        return res.status(200).json(new apiResponse(200, properties, "Property retrieved successfully"));
    } catch(error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const SetProperty = async (req, res, next) => {
    const {title, description, property_images, property_details, address, discounts_percentage, costs, property_check_details, staying_rules, cancellation_policy, amenities, important_information} = req.body;

    try {
        const property = await PropertiesModel.create({title, description, property_images, property_details, address, discounts_percentage, costs, property_check_details, cancellation_policy, amenities, important_information});
        await property.addStayingRules(staying_rules);
        return res.status(200).json(new apiResponse(200, property, "Property created successfully"));
    } catch(error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const DeleteProperty = async (req, res, next) => {
    const {id} = req.params;
    if(!id) {
        return next(new apiError(400, "Document ID required"));
    }
    
    try {
        const property = await PropertiesModel.deleteOne({_id: id});
        return res.status(200).json(new apiResponse(200, property, "Property deleted successfully"));
    } catch(error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const UpdateProperty = async(req, res, next) => {
    const {id} = req.params;
    const {updates} = req.body;
    
    if(!id) {
        return next(new apiError(400, "Document ID required"));
    }

    try {
        const property = await PropertiesModel.findByIdAndUpdate( id, { $set: updates }, { new: true, runValidators: true });
        return res.status(200).json(new apiResponse(200, property, "Property Updated Successfully"))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}