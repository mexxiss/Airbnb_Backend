import {Schema, model} from "mongoose";

const VideoGuidesSchema = new Schema({
    video_url: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
}, {timestamps: true});

export const VideoGuidesModel = model("videoguides", VideoGuidesSchema);