import { Schema, model } from "mongoose";

const UserDocumentsSchema = new Schema({
    title: String,
    expiry_date: {
        type: Date,
        default: Date.now
    },
    issue_date: {
        type: Date,
        default: Date.now
    },
    note: String,
    document: {
        type: String,
    },
    property: {
        type: Schema.Types.ObjectId,
        ref: "properties",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
}, {timestamps: true});

export const UserDocumentsModel = model("userdocuments", UserDocumentsSchema);