import { apiResponse } from "../../../utils/apiResponse.js";
import { apiError } from "../../../utils/apiError.js";
import { UserDocumentsModel } from "../../../models/UserDocuments.js";

export const SetUserDocument = async (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = "AUTHENTICATED Owner or Admin can set User Document by passing ID through JWT Token"
    // #swagger.description = "> TODO: Created document is sent back that may be unnecessary."
    /* #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: { $ref: "#/components/schema/UserDocumentsRequest" }
            }
        }
    } 
    */
    const user_id = req?.user?.id;
    const { title, expiry_date, issue_date, note, document, property } = req.body;

    if (!user_id) {
        return next(new apiError(400, `User required`));
    }

    try {
        const userdocuments = await UserDocumentsModel.create({ title, expiry_date, issue_date, note, document, property, user: user_id });
        return res.status(200).json(new apiResponse(200, userdocuments, "Created Successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const GetUserDocuments = async (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = "Get User Documents by passing property ID through query or params and user ID through JWT Token"
    // #swagger.description = "> TODO: Retrieved documents are sent back that may contain unnecessary information."

    const { property } = req.query || req.params;
    const user_id = req?.user?.id;

    if (!user_id) {
        return next(new apiError(400, `User required`));
    }

    try {
        let docs = await UserDocumentsModel.find({ property, user: user_id });
        if (docs.length === 0) {
            const defaultDocs = [
                { title: "DEWA Bills", property, user: user_id },
                { title: "Title Deeds", property, user: user_id },
                { title: "Passport", property, user: user_id },
            ];
            docs = await UserDocumentsModel.insertMany(defaultDocs);
        }
        return res.status(200).json({ docs });
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}

export const UpdateUserDocuments = async (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = "Update User Documents by passing ID through params or query and user ID through JWT Token"
    // #swagger.description = "> TODO: Updated document is sent back that may be unnecessary."
    /* #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: { $ref: "#/components/schema/UpdatesRequest" }
            }
        }
    } 
    */
    const { id } = req.params || req.query;
    const user_id = req?.user?.id;
    const { updates } = req.body;

    if (!updates) {
        return next(new apiError(400, `Payment Details Update required`));
    }
    if (!user_id) {
        return next(new apiError(400, `User required`));
    }

    try {
        const doc = await UserDocumentsModel.findOne({ _id: id });

        if (!doc) {
            return next(new apiError(404, `Payment Details not found`));
        }

        if (user_id !== doc.user.toString()) {
            return next(new apiError(403, `Not Authorized to change details`));
        }

        doc.set(updates);
        await doc.save({ validateBeforeSave: false });

        return res.status(200).json(doc);
    } catch (error) {
        return next(new apiError(500, `Server Error`));
    }
}