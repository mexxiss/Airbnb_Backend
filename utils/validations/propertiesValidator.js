import {apiError} from "../apiError.js"

export const propertiesValidator = (req, res, next) => {
    const {title, description, properties_images, property_details, address, discounts_percentage, costs, property_check_details, staying_rules, cancellation_policy, amenities, important_information} = req.body;

    const requiredFields = [title, description, ]

    if(properties_images.length < 1) {
        return next(new apiError(400, "Minimum 1 property_image is required"));
    }

}