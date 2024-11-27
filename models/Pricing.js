import { Schema, model } from "mongoose";

const PricingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    figures: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    offers: {
        type: [String],
        required: true,
    }
});

export const PricingModel = model("pricing", PricingSchema)