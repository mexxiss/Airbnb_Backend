import SendQuery from "../../../models/SendContactQuery.js";
import { apiError } from "../../../utils/apiError.js";

export const getAllContactQueries = async (req, res, next) => {
    const {page = 1, limit = 10} = req.query;

    try {
        const totalCount = await SendQuery.countDocuments(); 
        const queries = await SendQuery.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        const totalPages = Math.ceil(totalCount / limit);

        return res.status(200).json({ queries, totalCount, totalPages });
    } catch (err) {
        return next(new apiError(500, `Server error: ${err.message}`));
    }
}