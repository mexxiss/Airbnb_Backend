import {Schema, model} from 'mongoose';

const OwnerQueriesSchema = new Schema({
    question_type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, { timestamps: true });

export const OwnerQueriesModel = model('ownerqueries', OwnerQueriesSchema);