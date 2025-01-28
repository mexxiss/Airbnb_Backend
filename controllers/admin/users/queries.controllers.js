import { OwnerQueriesModel } from "../../../models/OwnerQueries.js";
import { apiError } from "../../../utils/apiError.js";

export const getQueriesByUser = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = 'Get queries by user'
    const { user } = req.query;

    if (!user) {
        return next(new apiError(400, "User required"));
    }

    try {
        const queries = await OwnerQueriesModel.find({ user }).sort({ createdAt: -1 });
        return res.status(200).json(queries);
    } catch (error) {
        return next(new apiError(500, `Server error: ${error.message}`));
    }
}

export const getQueries = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = 'Get all queries'
    const { user } = req.query || req.body;

    try {
        const queries = await OwnerQueriesModel.aggregate([
            {
                $group: {
                    _id: "$user",
                    count: { $sum: 1 },
                    pendingCount: { 
                        $sum: { 
                            $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] 
                        }, 
                    },
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails",
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 1,
                    user: {
                        _id: "$userDetails._id",
                        first_name: "$userDetails.first_name",
                        last_name: "$userDetails.last_name",
                        email: { $arrayElemAt: ["$userDetails.email", 0] }, 
                        phone: { $arrayElemAt: ["$userDetails.phone", 0] }, 
                        profile_img: "$userDetails.profile_img",
                    },
                    createdAt: 1,
                    count: 1,
                    pendingCount: 1,
                }
            },
            {
                $sort: { createdAt: 1 } 
            }
        ]);

        return res.status(200).json(queries);
    } catch (error) {
        return next(new apiError(500, `Server error: ${error}`));
    }
}

export const updateQueries = async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new apiError(400, 'id is required'));
    }

    const { updates } = req.body;

    if (!updates) {
        return next(new apiError(400, 'Updates are required'));
    }

    try {
        const updatedQuery = await OwnerQueriesModel.findByIdAndUpdate(id, updates, { new: true });
        return res.status(200).json({ updatedQuery });
    } catch (error) {
        return next(new apiError(500, `Server error: ${error}`));
    }
}

export const updateQuery = async (req, res, next) => {
    const { id } = req.params;
    const { updates } = req.body;
    
    if (!id) {
        return next(new apiError(400, 'id is required'));
    }
    
    if (!updates) {
        return next(new apiError(400, 'Updates are required'));
    }

    try {
        const query = await OwnerQueriesModel.findByIdAndUpdate(id, updates, {new: true});
        return res.status(200).json(query);
    } catch (err) {
        return next(new apiError(500, `Server error: ${err}`));
    }
}