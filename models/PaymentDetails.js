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
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    }
}, { timestamps: true });

export const PaymentDetailsModel = model("paymentdetails", PaymentDetailSchema);