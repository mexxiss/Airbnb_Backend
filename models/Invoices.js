import mongoose, { Schema, model } from "mongoose";
import { autoPopulateAllFields } from "../utils/commons.js";

const FurnishingSchema = new Schema(
  {
    property_id: {
      type: Schema.Types.ObjectId,
      ref: "properties",
      required: true,
    },
    isStatementGenrated: {
      type: Boolean,
      default: false,
    },
    invoiceNumber: { type: String, required: true, unique: true },
    statementPeriod: { type: String, required: true },
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
    status: {
      type: String,
      enum: ["Paid", "Overdue", "Pending"],
      default: "Pending",
    },
    furnishingDetails: {
      type: String,
    },
    totalFurnishingCost: { type: Number, required: true },
    receivedAmount: { type: Number, required: true },
    amountOwedToFP: { type: Number, required: true },
    bank_details: {
      type: Schema.Types.ObjectId,
      ref: "paymentdetails",
      required: true,
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const MonthalySchema = new mongoose.Schema(
  {
    property_id: {
      type: Schema.Types.ObjectId,
      ref: "properties",
      required: true,
    },
    isStatementGenrated: {
      type: Boolean,
      default: false,
    },
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
  },
  { timestamps: true }
);

const MaintenanceSchema = new Schema(
  {
    property_id: {
      type: Schema.Types.ObjectId,
      ref: "properties",
      required: true,
    },
    isStatementGenrated: {
      type: Boolean,
      default: false,
    },
    statementPeriod: { type: String, required: true },
    trn_number: { type: String, required: true },
    taxInvoiceNumber: { type: String, required: true, unique: true },
    essentialWorksImages: [
      {
        url: {
          type: String,
          required: true,
        },
        work_name: { type: String },
      },
    ],
    essentialWorks: [
      {
        itemService: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        priceUnit: {
          type: Number,
          required: true,
        },
        priceSummary: {
          type: Number,
          required: true,
        },
      },
    ],
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
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalMaintenceCost: { type: Number, required: true },
    receivedAmount: { type: Number, required: true },
    amountOwedToFP: { type: Number, required: true },
    bank_details: {
      type: Schema.Types.ObjectId,
      ref: "paymentdetails",
      required: true,
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Furnishing = model("Furnishing", FurnishingSchema);
export const MonthalySchemaModal = model("MonthalySchema", MonthalySchema);

export const MaintenanceInvoiceModal = model(
  "MaintenanceInvoice",
  MaintenanceSchema
);
