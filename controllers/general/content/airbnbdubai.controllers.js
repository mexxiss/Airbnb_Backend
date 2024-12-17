import { apiResponse } from '../../../utils/apiResponse.js';
import { apiError } from '../../../utils/apiError.js';
import { DubaiModel } from '../../../models/Dubai.js';

export const GetDubaiDetails = async (req, res, next) => {
    // #swagger.tags = ['General']
    try {
        const details = await DubaiModel.find().limit(1);
        return res.status(200).json(details[0]);
    } catch (error) {
        return next(new apiError(500, "Server Error"));
    }
}