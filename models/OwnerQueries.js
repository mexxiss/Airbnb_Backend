import { Schema, model } from 'mongoose';

const OwnerQueriesSchema = new Schema({
    question_type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    reply: {
        type: String,
    },
    status: {
        type: String,
        enum: ["Pending", "Replied", "Resolved"],
        default: "Pending",
    },
    expiry: {
        type: Date,
        default: () => new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), 
    },
}, { timestamps: true });

export const OwnerQueriesModel = model('ownerqueries', OwnerQueriesSchema);