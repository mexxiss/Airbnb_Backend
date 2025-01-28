import mongoose, { Schema } from "mongoose";

const DETLicenseSchema = new mongoose.Schema(
  {
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "properties",
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    price: {
      type: Number,
      required: true,
      default: 370,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
      default: function () {
        return new Date(new Date().setFullYear(new Date().getFullYear() + 1));
      },
    },
    renewed: {
      type: Boolean,
      default: false,
    },
    renewalDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

DETLicenseSchema.methods.renewLicense = function () {
  this.renewed = true;
  this.expiryDate = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1)
  );
  this.renewalDate = new Date();
};

const DETLicense = mongoose.model("DETLicense", DETLicenseSchema);

export default DETLicense;
