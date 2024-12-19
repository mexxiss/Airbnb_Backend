import { HomeContentModel } from "../../../models/HomeContent.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { formatNumber, formatWithCommas } from "../../../utils/commons.js";

export const GetHomeContent = async (req, res, next) => {
  // #swagger.tags = ['General']
  // #swagger.summary = 'Get Home Content for the home page of the website',

  try {
    const doc = await HomeContentModel.find();
    const otherObj = {
      property_return_rate: 7.6,
      property_rent: formatWithCommas(3856),
      daily_complete_transactions: formatWithCommas(2540),
      total_customers: formatNumber(50000),
      total_properties: formatNumber(10000),
      properties_sale: formatNumber(250),
      apartment_rent: formatNumber(550),
    };

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          { ...doc[0]._doc, ...otherObj },
          "Home Content retrieved successfully"
        )
      );
  } catch (error) {
    return next(new apiError(500, "Server Error"));
  }
};
