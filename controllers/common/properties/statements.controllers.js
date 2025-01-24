import { StatementModel } from "../../../models/Statements.js";
import { apiError } from "../../../utils/apiError.js";

export const getStatements = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    // #swagger.summary = "Get statements with filters"
    // #swagger.description = "> Retrieve a list of statements with optional filters"

    const { statement_type, property_id } = req.query;

    try {
        const query = {};

        if (statement_type === "maintenance") {
            query.statement_type = "maintenance";
        } else if (statement_type) {
            query.statement_type = statement_type;
        }

        if (property_id) {
            query.property = property_id;
        }

        const statements = await StatementModel.find(query);

        return res.status(200).json({ data: statements });
    } catch (e) {
        return next(new apiError(500, `Failed to fetch statements: ${e.message}`));
    }
};
