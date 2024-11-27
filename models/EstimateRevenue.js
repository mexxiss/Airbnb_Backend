import { Schema, model } from "mongoose";

const EstimateRevenueSchema = new Schema({
    area: {
        name: { type: String, required: true },
    },
    beds: [{
        name: { type: String, required: true },
        furnishing: [{
            name: {
                type: String,
                unique: true,
                enum: ["Premium", "Standard"],
                required: true,
            },
            price: { type: Number, required: true },
        }],
    }], 
});

export const EstimateRevenueModel = model("estimaterevenue", EstimateRevenueSchema);