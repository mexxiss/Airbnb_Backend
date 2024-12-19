import { FaqModel } from "../../../models/Faq.js";
import { apiResponse } from '../../../utils/apiResponse.js';
import { apiError } from '../../../utils/apiError.js';

export const GetFaqs = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can view the list of all FAQs on its Admin Panel"
    // #swagger.description = "> #TODO: Retrieved documents being sent back through response may contain unnecessary information",

    try {
        const faqs = await FaqModel.find();
        return res.status(200).json(new apiResponse(200, faqs, "Faqs retrieved successfully"));
    } catch (error) {
        return next(new apiError(500, "Server Error"));
    }
}

export const SetFaqs = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "AUTHORIZED Admin can add new FAQs"
    // #swagger.description = "> #TODO: Created document is being sent back through response that may be unnecessary",
    /* #swagger.requestBody = {
        required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/FaqsRequest" }  
            }
          }
      } 
    */
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
    // #swagger.summary = "AUTHORIZED Admin can delete any non-required FAQs by specifying ID within params"
    // #swagger.description = "> #TODO: Deleted document is being sent back through response that may be unnecessary",

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
    // #swagger.summary = "AUTHORIZED Admin can update existing FAQs by specifying ID within params"
    // #swagger.description = "> #TODO: Updated document is being sent back through response that may be unnecessary",
    /* #swagger.requestBody = {
        required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/FaqsRequest" }  
            }
          }
      } 
    */

    try {
        const { id } = req.params;
        const { question, answer, page } = req.body;

        if (!Array.isArray(page) || !page.every((p) => typeof p === "string")) {
            return res.status(400).json({ success: false, message: "Invalid 'page' format. Must be an array of strings." });
        }

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
