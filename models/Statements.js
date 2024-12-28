import { Schema, model } from "mongoose";

const StatementSchema = new Schema({
    statement: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publication_date: {
        type: Date,
        required: true
    }
}, { timestamps: true })

export const StatementModel = model("statement", StatementSchema);