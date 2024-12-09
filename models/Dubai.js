import { Schema, model } from "mongoose";

const DubaiSchema = new Schema({
    section1: {
        title: String,
        body: String
    },
    section2: {
        title: String,
        body: String,
        image: String,
        text_direction: String,
    },
    section3: {
        title: String,
        points: [{
            title: String,
            body: String
        }]
    },
    section4: {
        title: String,
        body: String,
        image: String,
        text_direction: String,
    },
    section5: {
        title: String,
        images: [String]
    }
});

export const DubaiModel = model("dubai", DubaiSchema)