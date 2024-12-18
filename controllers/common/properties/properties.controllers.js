import { PropertiesModel } from "../../../models/Properties.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const GetAllPropertiesByUser = async (req, res, next) => {
    // #swagger.tags = ['Users']
    const user_id = req._id;

    if (!user_id) {
        return next(new apiError(400, "User required"))
    }

    try {
        const properties = await PropertiesModel.find({ user: user_id }).populate('property_images').select('title description property_images property_details.rooms_count status');
        return res.status(200).json(new apiResponse(200, properties, "Property retrieved successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}