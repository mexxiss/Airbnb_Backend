import {
  Furnishing,
  MaintenanceInvoiceModal,
  MonthalySchemaModal,
} from "../../../models/Invoices.js";
import { StatementModel } from "../../../models/Statements.js";
import { apiError } from "../../../utils/apiError.js";

const updateStatementGeneratedFlag = async (
  statementType,
  property,
  title,
  isStatementGenrated = false
) => {
  let updateQuery;

  switch (statementType) {
    case "furnishing":
      updateQuery = { property_id: property, invoiceNumber: title };
      return Furnishing.findOneAndUpdate(
        updateQuery,
        { $set: { isStatementGenrated } },
        { new: true }
      );
    case "maintenance":
      updateQuery = { property_id: property, taxInvoiceNumber: title };
      return MaintenanceInvoiceModal.findOneAndUpdate(
        updateQuery,
        { $set: { isStatementGenrated } },
        { new: true }
      );
    case "revenue":
      updateQuery = {
        property_id: property,
        "invoiceDetails.invoiceNumber": title,
      };
      return MonthalySchemaModal.findOneAndUpdate(
        updateQuery,
        { $set: { isStatementGenrated } },
        { new: true }
      );
    default:
      throw new apiError(400, "Invalid statement type");
  }
};

export const addStatement = async (req, res, next) => {
  let {
    url = "",
    title = "",
    total_amount = 0,
    received_amount = 0,
    net_amount_to_pay = 0,
    statement_type = "",
    property = "",
  } = req.body;

  if (!url || !title || !property || !statement_type) {
    return next(new apiError(400, "Incomplete or missing required fields"));
  }

  const existStatement = await StatementModel.exists({ title });
  if (existStatement) {
    return res.status(409).json({ message: "Statement already exists" }); // Changed to 409 for conflict
  }

  try {
    const newStatement = await StatementModel.create({
      url,
      title,
      total_amount,
      received_amount,
      net_amount_to_pay,
      statement_type,
      property,
    });

    await updateStatementGeneratedFlag(statement_type, property, title, true);

    return res.status(201).json({
      data: newStatement,
      message: "Statement Generated Successfully",
    });
  } catch (e) {
    return next(new apiError(500, `Failed to add statement: ${e.message}`));
  }
};

export const deleteStatement = async (req, res, next) => {
  const { title } = req.params;

  if (!title) {
    return next(new apiError(400, "Title parameter is required"));
  }

  try {
    const deletedStatement = await StatementModel.findOneAndDelete({ title });

    if (!deletedStatement) {
      return res.status(404).json({ message: "Statement not found" });
    }

    await updateStatementGeneratedFlag(
      deletedStatement.statement_type,
      deletedStatement.property,
      title,
      false
    ); // Refactored

    return res.status(200).json({ message: "Statement deleted successfully" });
  } catch (e) {
    return next(new apiError(500, `Failed to delete statement: ${e.message}`));
  }
};
