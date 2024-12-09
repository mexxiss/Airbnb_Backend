import { Schema, model } from "mongoose";

const RequirementSchema = new Schema({
    head: {
        title: {
            type: String,
        },
        body: {
            type: String,
            required: true
        },
    },
    points: [{
        title: {
            type: String,
        },
        body: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
        text_direction: {
            type: String,
        },
        order_no: {
            type: Number,
            required: true
        }
    }],
});

export const RequirementsModel = model("requirements", RequirementSchema);