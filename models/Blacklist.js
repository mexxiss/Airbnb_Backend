import { Schema, model } from "mongoose";

const BlacklistSchema = new Schema({
    token: {
        type: String,
        required: true,
        ref: 'Users'
    }
}, { timestamps: true });

export const BlacklistModel = model("blacklist", BlacklistSchema);