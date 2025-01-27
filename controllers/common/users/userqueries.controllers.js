import { OwnerQueriesModel } from "../../../models/OwnerQueries.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const addQuery = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = "Add query"
    // #swagger.description = "Endpoint to add query"
    /* #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Query object',
        required: true,
        schema: { $ref: '#/components/schemas/QueryRequest' }
    } */

    const { question_type, message } = req.body;
    const user = req.user.id;

    if (!question_type || !message || !user) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const query = await OwnerQueriesModel.create({ question_type, message, user })
        return res.status(200).json(new apiResponse(200, query, "Query created successfully"));
    } catch (err) {
        return next(new apiError(500, `Server error: ${err.message}`));
    }
} 

export const getQueries = async (req, res) => {
    // #swagger.tags = ['General']
    // #swagger.summary = "Get all queries"
    // #swagger.description = "Endpoint to get all queries"
    
    const user = req?.user?.id;

    try {
        const queries = await OwnerQueriesModel.find({user}).sort({createdAt: -1})
        return res.status(200).json(new apiResponse(200, queries, "Query retrieved successfully"));
    } catch (err) {
        return next(new apiError(500, `Server error: ${err.message}`));
    }
}