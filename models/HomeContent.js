import { Schema, model } from "mongoose";

const HomeContentSchema = new Schema({
    banner_images: {
        type: [String],
        required: true,
    },
    what_people_says: {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        facts: [{
            icon: { type: String },
            title: { type: String },
            description: { type: String }
        }]
    },
    features: [
        {
            title: {
                type: String
            },
            description: {
                type: String
            },
            icon: {
                type: String
            }
        }
    ], 
});

export const HomeContentModel = model("homeContent", HomeContentSchema);