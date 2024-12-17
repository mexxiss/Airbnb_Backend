import { FaqModel } from "../models/Faq.js";
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';

export const GetFaqs = async (req, res, next) => {
    try {
        const faqs = await FaqModel.find();
        return res.status(200).json(new apiResponse(200, faqs, "Faqs retrieved successfully"));
    } catch (error) {
        return next(new apiError(500, "Server Error"));
    }
}

export const GetFilteredFaqs = async (req, res, next) => {
    // #swagger.tags = ['General']
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

export const SetFaqs = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    const { question, answer, page } = req.body;

    if (!question || !answer || !page) {
        return next(new apiError(400, "Faq information is incomplete"));
    }

    try {
        const faq = await FaqModel.create({ question, answer, page });
        return res.status(200).json(new apiResponse(200, faq, "Faq added successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const DeleteFaq = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    const { id } = req.params;

    if (!id) {
        return next(new apiError(400, "Faq information is incomplete"))
    }

    try {
        const faq = await FaqModel.deleteOne({ _id: id });
        return res.status(200).json(new apiResponse(200, faq, "Faq deleted successfully"));
    } catch (error) {
        return next(new apiError(500, "Server Error"));
    }
}

export const UpdateFaq = async (req, res) => {
    // #swagger.tags = ['Admin']
    try {
        const { id } = req.params;
        const { question, answer, page } = req.body;

        // Validate the input (optional)
        if (!Array.isArray(page) || !page.every((p) => typeof p === "string")) {
            return res.status(400).json({ success: false, message: "Invalid 'page' format. Must be an array of strings." });
        }

        // Perform the update
        const updatedFaq = await FaqModel.findByIdAndUpdate(
            id,
            { question, answer, page },
            { new: true, runValidators: true }
        );

        if (!updatedFaq) {
            return res.status(404).json({ success: false, message: "FAQ not found." });
        }

        return res.status(200).json({ success: true, data: updatedFaq });
    } catch (error) {
        console.error("Error updating FAQ:", error);
        return res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
    }
};
