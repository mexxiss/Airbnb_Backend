import { OwnerQueriesModel } from "../../../models/OwnerQueries.js";
import { apiError } from "../../../utils/apiError.js";

export const getQueries = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = 'Get all queries'
    const {user} = req.query || req.body;

    try {
        const queries = await OwnerQueriesModel.find({user});
        return res.status(200).json({ queries });
    } catch (error) {
        return next(new apiError(500, `Server error: ${error}`));
    }
}

export const updateQueries = async (req, res, next) => {
    const {id} = req.params;

    if (!id) {
        return next(new apiError(400, 'id is required'));
    }

    const { updates } = req.body;
    
    if (!updates) {
        return next(new apiError(400, 'Updates are required'));
    }

    try {
        const updatedQuery = await OwnerQueriesModel.findByIdAndUpdate(id, updates, { new: true });
        return res.status(200).json({ updatedQuery });
    } catch (error) {
        return next(new apiError(500, `Server error: ${error}`));
    }
}