import {Schema, model} from "mongoose";

const GallaryTypesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
});

GallaryTypesSchema.pre("save", function (next) {
    if(this.name) {
        this.name = this.name.split(" ").map(word => word.charAt(0).toUpperCase()+word.slice(1).toLowerCase()).join(" ");
    }
    next();
})

export const GallaryTypesModel = model("gallarytypes", GallaryTypesSchema);