import {Schema, model} from 'mongoose';

const ServicesSchema = new Schema ({
    name: {
        type: String
    }
});

export const ServicesModel = model("services", ServicesSchema);