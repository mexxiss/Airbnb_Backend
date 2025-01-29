import { PropertyQueryModel } from "../../../models/PropertyQueries.js"
import { apiError } from "../../../utils/apiError.js";

export const getPropertyQueries = async (req, res, next) => {
    const {page = 1, limit = 10} = req.query;
    try {
        const totalCount = await PropertyQueryModel.countDocuments();
        const queries = await PropertyQueryModel.find().sort({createdAt: -1}).skip((page - 1) * limit).limit(limit);
        const totalPages = Math.ceil(totalCount / limit);
        
        return res.status(200).json({totalCount, queries, totalPages});
    } catch (err) {
        console.log(err.message);
        
        return next(new apiError(500, `Server error: ${err.message}`));
    }
}