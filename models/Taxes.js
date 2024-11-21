import { Schema, model } from "mongoose";

const TaxesSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  tax_type: {
    type: String,
    required: [true, "name is of tax_type"],
  },
  tax_ratio: {
    type: Number,
    required: [true, "name has tax_ratio"],
  },
});

export const TaxModel = model("taxes", TaxesSchema);
