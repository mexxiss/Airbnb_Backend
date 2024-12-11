import { EstimateRevenueModel } from "../models/EstimateRevenue.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const AddRevenueDetails = async (req, res, next) => {
    const { area, beds } = req.body;

    if (!area || !Array.isArray(beds)) {
        return next(new apiError(400, "Incomplete Parameters"));
    }

    try {
        const revenue = await EstimateRevenueModel.create({ area, beds });
        return res.status(200).json(new apiResponse(200, revenue, "Revenue created successfully"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`));
    }
}

export const GetAreas = async (req, res, next) => {
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
    return res.status(200).json({regions, bedrooms})
}