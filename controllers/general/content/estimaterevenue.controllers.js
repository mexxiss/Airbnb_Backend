import { EstimateRevenueModel } from "../../../models/EstimateRevenue.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const GetAreas = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = 'Endpoint to get areas & bedrooms to map on website's UI - Estimate Revenue Page'

    const regions = [
        "Al Barsha South",
        "Al Furjan",
        "Al Jaddaf",
        "Arabian Ranches (Villas)",
        "Bluewaters Island",
        "Business Bay",
        "Citywalk",
        "DAMAC Hills (Apartments)",
        "DAMAC Hills (Villas)",
        "DIFC",
        "Discovery Gardens",
        "Downtown Dubai",
        "Dubai Hills",
        "Dubai South",
        "Festival City",
        "Greens",
        "JVT / JVC",
        "Jumeirah Beach Residences (JBR)",
        "Jumeirah Lake Towers (JLT)",
        "MBR City",
        "Madinat Jumeirah",
        "Marina",
        "Meydan",
        "Palm Jumeirah",
        "Ras Al Khor",
        "Silicon Oasis",
        "Sports City/IMPZ",
        "Springs (Villas)",
        "Tecom"
    ];
    const bedrooms = [
        "One Bed",
        "Two Bed",
        "Three Bed",
        "Four Bed",
        "Studio",
        "Five Bed",
        "Six Bed"
    ]
    return res.status(200).json({ regions, bedrooms })
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