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