import { Schema, model } from "mongoose";

const PropertyUtilitiesSchema = new Schema({
    name: String,
    account_no: String,
    paid_by: {
        type: String,
        enum: ["Owner", "Airbnb"]
    },
    web_login: String,
    web_pass: String,
    link: String,
    uploads: [String],
    property: {
        type: Schema.Types.ObjectId,
        ref: "properties"
    }
}, {timestamps: true});

export const PropertyUtilitiesModel = model("propertyutilities", PropertyUtilitiesSchema);