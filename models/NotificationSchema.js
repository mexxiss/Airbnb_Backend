import mongoose from "mongoose";
const { Schema, model } = mongoose;

const NotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users", // Reference to the user receiving the notification
      required: true,
    },
    type: {
      type: String,
      enum: [
        "property_created",
        "booking",
        "revenue",
        "furnishing",
        "maintenance",
        "statement",
        "invoice",
        "property_status",
      ],
      required: true,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
      refPath: "typeRef",
      required: true,
    },
    typeRef: {
      type: String,
      required: true,
      enum: [
        "properties",
        "bookings",
        "monthalyschemas",
        "furnishings",
        "maintenances",
        "statements",
        "maintenanceinvoices",
        "bookeddates",
        "detlicenses",
      ],
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const NotificationModel = model("notifications", NotificationSchema);
