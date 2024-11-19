import { Schema, model } from "mongoose";

// Not Completed - on hold

const TestimonialsSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },

});

export const TestimonialsModel = model("testimonials", TestimonialsSchema)