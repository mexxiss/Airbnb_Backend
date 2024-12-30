import { Schema, model } from "mongoose";

const LegalSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["terms", "privacy", "refund"]
    },
    body: {
        type: String,
        required: true
    }
}, {timestamps: true});

LegalSchema.pre("save", function (next) {
    if(this.title) {
        this.title = this.title.split(" ").map(word => word.charAt(0).toUpperCase()+word.slice(1).toLowerCase()).join(" ");
    }
    next();
});

export const LegalModel = model("legals", LegalSchema);