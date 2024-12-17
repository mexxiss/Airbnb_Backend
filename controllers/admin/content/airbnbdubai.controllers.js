import { apiResponse } from '../../../utils/apiResponse.js';
import { apiError } from '../../../utils/apiError.js';
import { DubaiModel } from '../../../models/Dubai.js';

export const SetDubaiDetails = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    const { section1, section2, section3, section4, section5 } = req.body;

    if (!section1 || !section2 || !section3 || !section4 || !section5) {
        return next(new apiError(400, "Dubai information is incomplete"));
    }

    try {
        const details = await DubaiModel.create({ section1, section2, section3, section4, section5 });
        return res.status(200).json(new apiResponse(200, details, "Information added successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const DeleteDubaiDetails = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    const { id } = req.params;

    if (!id) {
        return next(new apiError(400, "Dubai information is incomplete"))
    }

    try {
        const faq = await DubaiModel.deleteOne({ _id: id });
        return res.status(200).json(new apiResponse(200, faq, "Dubai Info deleted successfully"));
    } catch (error) {
        return next(new apiError(500, "Server Error"));
    }
}