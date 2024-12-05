import { Schema, model } from "mongoose";

const BlogsSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    subtitle: {
        type: String
    },
    body:{
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "blogcategory",
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    added_on: {
        type: String,
    }
}, {timestamps: true});

BlogsSchema.pre("save", function (next) {
    const date = this.added_on ? new Date(this.added_on) : new Date();
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
    this.added_on = formattedDate;
    next();
});

export const BlogsModel = model("blogs", BlogsSchema);