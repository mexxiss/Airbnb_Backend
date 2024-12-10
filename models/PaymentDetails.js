import { Schema, model } from "mongoose";

const PaymentDetailSchema = new Schema({
    accountHolderName: { type: String },
    accountNumber: { type: String },
    bankName: { type: String },
    swiftCode: { type: String },
    iban: { type: String },
    paymentMethod: {
        type: String,
        default: "Bank Transfer",
    },
    currency: {
        type: String,
        default: "AED"
    },
    address: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        unique: true
    }
}, { timestamps: true });

export const PaymentDetailsModel = model("paymentdetails", PaymentDetailSchema);