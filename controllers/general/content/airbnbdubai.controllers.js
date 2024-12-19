import { apiResponse } from '../../../utils/apiResponse.js';
import { apiError } from '../../../utils/apiError.js';
import { DubaiModel } from '../../../models/Dubai.js';

export const GetDubaiDetails = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = 'Endpoint to get Airbnb Dubai details to map on website's UI - Airbnb Dubai Page'
    // #swagger.description = '> #TODO: Retrieved documents may contain non-required information.'

    try {
        const details = await DubaiModel.find().limit(1);
        return res.status(200).json(details[0]);
    } catch (error) {
        return next(new apiError(500, "Server Error"));
    }
}