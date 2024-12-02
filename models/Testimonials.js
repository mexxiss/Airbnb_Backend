import { Schema, model } from "mongoose";

const TestimonialsSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    }
}, {timestamps: true});

export const TestimonialsModel = model("testimonials", TestimonialsSchema)