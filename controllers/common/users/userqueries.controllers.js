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

    const { general_question, message } = req.body;
    const user = req.user.id;

    if (!general_question || !message || !user) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const query = await OwnerQueriesModel.create({ general_question, message, user })
        return res.status(200).json(new apiResponse(200, "", "Query created successfully"));
    } catch (err) {
        return next(new apiError(500, `Server error: ${err.message}`));
    }
} 