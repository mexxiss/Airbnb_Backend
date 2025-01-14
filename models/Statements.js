import { Schema, model } from "mongoose";

const StatementSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    received_amount: {
      type: Number,
      required: true,
    },
    net_amount_to_pay: {
      type: Number,
      required: true,
    },
    statement_type: {
      type: String,
      enum: ["revenue", "furnishing", "maintenance"],
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "properties",
    },
  },
  { timestamps: true }
);

export const StatementModel = model("statement", StatementSchema);
