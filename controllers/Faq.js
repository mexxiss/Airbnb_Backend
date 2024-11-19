import { FaqModel } from "../models/Faq.js";
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';

export const GetFaqs = async (req, res, next) => {
    try {
        const faqs = await FaqModel.find();
        return res.status(200).json(new apiResponse(200, faqs, "Faqs retrieved successfully"));
    } catch(error) {
        return next(new apiError(500, "Server Error"));
    }
}

export const SetFaqs = async (req, res, next) => {
    const {question, answer} = req.body;

    if(!question || !answer) {
        return next(new apiError(400, "Faq information is incomplete"));
    }

    try {
        const faq = await FaqModel.create({question, answer});
        return res.status(200).json(new apiResponse(200, faq, "Faq added successfully"));
    } catch (error) {
        return next(new apiError(500, "Server Error"));
    }
}

export const DeleteFaq = async (req, res, next) => {
    const {id} = req.params;

    if (!id) {
        return next(new apiError(400, "Faq information is incomplete"))
    }

    try {
        const faq = await FaqModel.deleteOne({_id: id});
        return res.status(200).json(new apiResponse(200, faq, "Faq deleted successfully"));
    } catch (error) {
        return next(new apiError(500, "Server Error"));
    }
}

export const UpdateFaq = async (req, res, next) => {
    const {id} = req.params;
    const {question, answer} = req.body;

    if(!id || !question || !answer) {
        return next(new apiError(400, "Faq information is incomplete"));
    }

    try {
        const faq = await FaqModel.updateOne({_id: id}, {question, answer});
        return res.status(200).json(new apiResponse(200, faq, "Faq updated successfully"))
    } catch(error) {
        return next(new apiError(500, "Server Error"));
    }
}