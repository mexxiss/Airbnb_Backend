import mongoose, { Schema, model } from "mongoose";

// const CounterSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   seq: { type: Number, required: true, default: 0 },
// });

const FurnishingSchema = new Schema({
  invoiceType: { type: String, default: "Furnishing" },
  invoiceFrom: {
    clientName: { type: String, required: true },
    property: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  invoiceTo: {
    clientName: { type: String, required: true },
    property: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ["Paid", "Overdue", "Pending"],
    default: "Pending",
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

const MonthalySchema = new mongoose.Schema({
  companyDetails: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
  ownerDetails: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
  invoiceDetails: {
    date: { type: Date, required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    statementPeriod: { type: String, required: true },
  },
  reservations: [
    {
      reservationCode: { type: String, required: true },
      guestName: { type: String, required: true },
      checkIn: { type: Date, required: true },
      checkOut: { type: Date, required: true },
      totalNights: { type: Number, required: true },
      netRentalIncome: { type: Number, required: true },
    },
  ],
  summary: {
    totalIncome: { type: Number, required: true },
    managementFee: {
      percentage: { type: Number, required: true },
      amount: { type: Number, required: true },
    },
    expenses: [
      {
        description: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    netAmountDue: { type: Number, required: true },
  },
  footer: { type: String, required: false }, // e.g., "Kind regards, Mexxstates"
});

// MonthalySchema.pre("save", async function (next) {
//   const invoice = this;

//   if (!invoice.invoiceDetails.invoiceNumber) {
//     try {
//       const counter = await CounterSchema.findOneAndUpdate(
//         { name: "invoice" },
//         { $inc: { seq: 1 } },
//         { new: true, upsert: true }
//       );
//       invoice.invoiceDetails.invoiceNumber = `INV-${counter.seq}`;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });

export const Furnishing = model("Furnishing", FurnishingSchema);
export const MonthalySchemaModal = model("MonthalySchema", MonthalySchema);
