import { Schema, model } from "mongoose";

const FaqSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true, 
    }
});

export const FaqModel = model("faq", FaqSchema);