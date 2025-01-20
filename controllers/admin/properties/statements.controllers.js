import { StatementModel } from "../../../models/Statements.js";
import { apiError } from "../../../utils/apiError.js";

export const addStatement = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "Add a new statement"
  // #swagger.description = "> #TODO: Implement validation for input fields",
  /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/StatementRequest" }
            }
        }
    } */

  const {
    url,
    title,
    total_amount,
    received_amount,
    net_amount_to_pay,
    statement_type,
    property,
  } = req.body;

  if (
    !url ||
    !title ||
    !total_amount ||
    !received_amount ||
    !net_amount_to_pay ||
    !property ||
    !statement_type
  ) {
    return next(new apiError(400, "Incomplete or missing required fields"));
  }

  try {
    const newStatement = StatementModel.create({
      url,
      title,
      total_amount,
      received_amount,
      net_amount_to_pay,
      statement_type,
      property,
    });
    return res.status(200).json(newStatement);
  } catch (e) {
    return next(new apiError(500, `Failed to add statement: ${e.message}`));
  }
};

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
