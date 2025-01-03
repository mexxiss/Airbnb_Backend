import { EstimateRevenueModel } from "../../../models/EstimateRevenue.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const GetAreas = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = 'Endpoint to get areas & bedrooms to map on website's UI - Estimate Revenue Page'

    try {
        const regions = await EstimateRevenueModel.find();
        if (!regions) {
            return res.status(404).json({ message: "No regions found." });
        }
        return res.status(200).json(regions);
    } catch (e) {
        return next(apiError(res, 500, "Server error fetching regions."));
    }
}

export const GetEstimateRevenueList = async (req, res) => {
    // #swagger.tags = ['General']
    // #swagger.summary = 'Endpoint to get estimated revenue list for all areas and bedrooms'

    try {
        const list = await EstimateRevenueModel.find();
        if (!list) {
            return res.status(404).json({ message: "No estimated revenue list found." });
        }
        return res.status(200).json(list);
    } catch (error) {
        return res.status(500).json({ message: "Server error fetching estimated revenue list." });
    }
}

export const GetEstimatedRevenue = async (req, res) => {
    // #swagger.tags = ['General']
    // #swagger.summary = 'Endpoint to get estimated revenue for a given area and bedroom'
    
    const { id } = req.params;
    const { beds, furnishing_id } = req.query;

    if (!id || !beds || !furnishing_id) {
        return res.status(400).json({ message: "Missing required parameters: id, bedId, or furnishingId." });
    }

    try {
        const area = await EstimateRevenueModel.findById(id);
        if (!area) {
            return res.status(404).json({ message: "Area not found." });
        }

        const selectedBed = area.beds.find(bed => bed._id.toString() === beds);
        if (!selectedBed) {
            return res.status(404).json({ message: "Bed type not found." });
        }

        const selectedFurnishing = area.furnishing.find(furnish => furnish._id.toString() === furnishing_id);
        if (!selectedFurnishing) {
            return res.status(404).json({ message: "Furnishing type not found." });
        }

        const basePrice = area.base_price;
        const bedIncrement = selectedBed.increment;
        const furnishingIncrement = selectedFurnishing.increment;

        const revenue = basePrice * (1 + bedIncrement) * (1 + furnishingIncrement);

        return res.status(200).json({
            areaName: area.area_name,
            basePrice,
            bedTitle: selectedBed.title,
            furnishingTitle: selectedFurnishing.title,
            revenue: Math.round(revenue) 
        });
    } catch (error) {
        console.error("Error calculating revenue:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}