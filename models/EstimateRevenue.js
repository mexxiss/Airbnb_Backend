import { Schema, model } from "mongoose";

const EstimateRevenueSchema = new Schema({
    area_name: { 
        type: String,
        required: true
    },
    base_price: {
        type: Number,
        required: true
    },
    beds: [{
        title: { type: String, required: true },
        increment: { type: Number, required: true }
    }],
    furnishing: [{
        title: { type: String, required: true, enum: ["Premium", "Standard"] },
        increment: { type: Number, required: true }
    }],
    coordinates: {
        latitude: { type: String },
        longitude: { type: String }
    }
}, { timestamps: true });

EstimateRevenueSchema.methods.calculatePrice = function (beds, furnishing) {
    return this.base_price * (1 + beds) * (1 + furnishing);
}

export const EstimateRevenueModel = model("estimaterevenue", EstimateRevenueSchema);