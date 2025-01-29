import { PropertyQueryModel } from "../../../models/PropertyQueries.js"
import { apiError } from "../../../utils/apiError.js";

export const getPropertyQueries = async (req, res, next) => {

    try {
        const queries = await PropertyQueryModel.find().sort({createdAt: 1});
        return res.status(200).json(queries);
    } catch (err) {
        console.log(err.message);
        
        return next(new apiError(500, `Server error: ${err.message}`));
    }
}