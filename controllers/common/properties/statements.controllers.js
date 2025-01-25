import mongoose from "mongoose";
import { StatementModel } from "../../../models/Statements.js";
import { apiError } from "../../../utils/apiError.js";

export const getStatements = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "Get statements with filters"
    // #swagger.description = "> Retrieve a list of statements with optional filters"

    const { statement_type, property_id, page = 1, limit = 10 } = req.query;

    try {
        const query = {};

        if (statement_type === "maintenance") {
            query.statement_type = "maintenance";
        } else if (statement_type) {
            query.statement_type = statement_type;
        }

        if (property_id) {
            query.property = new mongoose.Types.ObjectId(property_id);
        }

        const sortCriteria = { createdAt: -1 };

        const result = await StatementModel.aggregate([
            { $match: query },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    documents: [
                        { $sort: sortCriteria },
                        { $skip: (page - 1) * limit },
                        { $limit: parseInt(limit) },
                    ]
                }
            }
        ]);

        const totalCount = result[0]?.totalCount[0]?.count || 0;
        const statements = result[0]?.documents || [];

        return res.status(200).json({ statements, totalCount });
    } catch (e) {
        return next(new apiError(500, `Failed to fetch statements: ${e.message}`));
    }
};
