import { Schema, model } from "mongoose";

const MaintenanceSchema = new Schema({
    issue: { type: String },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved"],
        default: "Pending",
    },
    cost: { type: Number, default: 0 },
    property: {
        type: Schema.Types.ObjectId,
        ref: "properties"
    },
}, {timestamps: true});

MaintenanceSchema.index({ property: 1 })

export const MaintenanceModel = model("maintenance", MaintenanceSchema);