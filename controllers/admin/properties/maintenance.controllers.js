import { MaintenanceModel } from "../../../models/Maintenance.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const AddMaintenance = async(req, res, next) => {
    // #swagger.tags = ['Admin']
    const {issue, status, cost, property} = req.body;

    if(!issue || !cost || !property) {
        return next(new apiError(400, "Incomplete Data"));
    }

    try {
        const maintenance = await MaintenanceModel.create({issue, status, cost, property});
        return res.status(200).json(new apiResponse(200, maintenance, "Maintenance Added"));
    } catch(error) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}