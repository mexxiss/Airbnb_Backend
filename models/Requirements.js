import { Schema, model } from "mongoose";

const RequirementSchema = new Schema({
    title: {
        type: String,
    },
    image: {
        type: String,
    },
    body: {
        type: String,
        required: true
    },
    text_direction: {
        type: String,
    },
    order_no: {
        type: Number,
        required: true
    }
});

export const RequirementsModel = model("requirements", RequirementSchema);