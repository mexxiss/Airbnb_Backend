import { Schema, model } from "mongoose";

const PropertyUtilitiesManagerSchema = new Schema(
  {
    utility_name: {
      type: String,
    },
    manage_allow: {
      type: Boolean,
      default: false,
    },
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

export const PropertyUtilitiesManagerModel = model(
  "propertyutilitiesmanager",
  PropertyUtilitiesManagerSchema
);
