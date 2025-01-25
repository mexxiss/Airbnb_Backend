import { Schema, model } from "mongoose";

const PropertyUtilitiesManagerSchema = new Schema(
  {
    internet: {
      service_provider: String,
      web_login: String,
      web_pass: String,
      service_name: {
        type: String,
        default: "Internet",
      },
      account_no: String,
      paid_by: {
        type: String,
        enum: ["Owner", "Company"],
        default: "Company"
      },
      already_have_account: {
        type: Boolean,
        default: false,
      },
      field_name: {
        type: String,
        default: "internet"
      },
    },
    electricity_water: {
      service_provider: String,
      web_login: String,
      web_pass: String,
      service_name: {
        type: String,
        default: "Electricity & Water",
      },
      account_no: String,
      paid_by: {
        type: String,
        enum: ["Owner", "Company"],
        default: "Company"
      },
      already_have_account: {
        type: Boolean,
        default: false,
      },
      field_name: {
        type: String,
        default: "electricity_water"
      },
    },
    gas: {
      service_provider: String,
      web_login: String,
      web_pass: String,
      service_name: {
        type: String,
        default: "Gas",
      },
      account_no: String,
      paid_by: {
        type: String,
        enum: ["Owner", "Company"],
        default: "Company"
      },
      already_have_account: {
        type: Boolean,
        default: false,
      },
      field_name: {
        type: String,
        default: "gas"
      },
    },
    chiller: {
      service_provider: String,
      web_login: String,
      web_pass: String,
      service_name: {
        type: String,
        default: "Chiller",
      },
      account_no: String,
      paid_by: {
        type: String,
        enum: ["Owner", "Company"],
        default: "Company"
      },
      already_have_account: {
        type: Boolean,
        default: false,
      },
      field_name: {
        type: String,
        default: "chiller"
      },
    },
    other: [{
      temp_id: Number,
      service_provider: String,
      web_login: String,
      web_pass: String,
      service_name: {
        type: String,
        default: "Others",
      },
      account_no: String,
      paid_by: {
        type: String,
        enum: ["Owner", "Company"],
        default: "Company"
      },
      already_have_account: {
        type: Boolean,
        default: false,
      },
      link: String,
      uploaded_docs: String,
      field_name: {
        type: String,
        default: "other"
      },
    }],
    property: {
      type: Schema.Types.ObjectId,
      ref: "property",
    },
    user: {
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
