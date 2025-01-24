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

  const existStatement = await StatementModel.exists({ title });

  if (existStatement) {
    return res.status(200).json({ message: "Statement already exists" });
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
    return res
      .status(201)
      .json({ data: newStatement, message: "Statement Genrated Succesfully" });
  } catch (e) {
    return next(new apiError(500, `Failed to add statement: ${e.message}`));
  }
};