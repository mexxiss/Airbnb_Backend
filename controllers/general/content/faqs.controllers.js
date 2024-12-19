import { FaqModel } from "../../../models/Faq.js";
import { apiResponse } from '../../../utils/apiResponse.js';
import { apiError } from '../../../utils/apiError.js';

export const GetFilteredFaqs = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = 'Get filtered FAQs based on page',

    const { page } = req.query;
    const query = {};

    if(query) {
        query.page = {$in: [page]}
    }

    try {
        const faqs = await FaqModel.find(query);
        return res.status(200).json(new apiResponse(200, faqs, `Data retrieved for ${page}`))
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}