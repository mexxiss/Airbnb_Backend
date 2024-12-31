import { Schema, model } from "mongoose";

const FurnishingSchema = new Schema({
  invoiceId: { type: String, required: true },
  invoiceType: { type: String, default: "Furnishing" },
  clientDetails: {
    clientName: { type: String, required: true },
    property: { type: String, required: true },
    address: { type: String, required: true },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  dateDetails: {
    invoiceDate: { type: String, required: true },
    month: { type: String, required: true },
  },
  furnishingDetails: {
    budget: { type: Number, required: true },
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, default: 0 },
        totalPrice: { type: Number, default: 0 },
      },
    ],
    totalFurnishingCost: { type: Number, required: true },
    receivedAmount: { type: Number, required: true },
    amountOwedToFP: { type: Number, required: true },
  },
  bankDetails: {
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bankName: { type: String, required: true },
    iban: { type: String, required: true },
    swiftCode: { type: String, required: true },
  },
  notes: { type: String, default: "" },
});

export const Furnishing = model("Furnishing", FurnishingSchema);
