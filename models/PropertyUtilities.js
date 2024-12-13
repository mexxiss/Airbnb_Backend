import { Schema, model } from "mongoose";

const PropertyUtilitiesSchema = new Schema(
  {
    name: String,
    provider_name: String,
    account_no: String,
    paid_by: {
      type: String,
      enum: ["Owner", "Company"],
    },
    web_login: String,
    web_pass: String,
    already_have_account: {
      type: Boolean,
      default: false,
    },
    link: String,
    uploads: String,
    type: { type: String, default: "other" },
    property: {
      type: Schema.Types.ObjectId,
      ref: "properties",
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);
        
export const PropertyUtilitiesModel = model(
  "propertyutilities",
  PropertyUtilitiesSchema
);
