import mongoose from "mongoose";
import { BookedDatesModel } from "../../../models/BookedDates.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { PropertiesModel } from "../../../models/Properties.js";

export const UpdateBookedDates = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "AUTHORIZED Admin can update dates booked (from frontend) by sending the document ID within path"
  // #swagger.description = "> #TODO: Updated document is being sent back through response that may be unnecessary",
  /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/UpdateBookedDatesRequest" }  
            }
        }
      } 
    */
  const { id } = req.params;
  const { checkin_date, checkout_date } = req.body;

  try {
    const isoCheckinDate = new Date(checkin_date).toISOString();
    const isoCheckoutDate = new Date(checkout_date).toISOString();

    const updatedDates = await BookedDatesModel.findByIdAndUpdate(
      id,
      {
        $set: { checkin_date: isoCheckinDate, checkout_date: isoCheckoutDate },
      },
      { new: true }
    );

    if (!updatedDates) {
      return res.status(404).json({ message: "Booked dates not found" });
    }

    res.status(200).json(updatedDates);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating booked dates",
      error,
    });
  }
};

export const DeleteBookedDates = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "AUTHORIZED Admin can delete any reservation by passing ID within path"
  // #swagger.description = "> #TODO: Deleted document is being sent back through response that may contain unnecessary information",

  const { id } = req.params;

  if (!id) {
    return next(new apiError(400, "ID not provided"));
  }

  try {
    const date = await BookedDatesModel.deleteOne(id);
    return res
      .status(200)
      .json(new apiResponse(200, date, "Deleted Booked Date"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const GetAllBookings = async (req, res, next) => {
  const { page = 1, limit = 10, property } = req.query;

  if (!property || !mongoose.isValidObjectId(property)) {
    return next(new apiError(400, "Property ID not provided"));
  }

  try {
    const totalCount = await BookedDatesModel.countDocuments({ property });
    const totalPages = Math.ceil(totalCount / limit);

    const propertyDetail = await PropertiesModel.findById(property);

    const bookings = await BookedDatesModel.find({ property })
      .populate("book_details")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res
      .status(200)
      .json({
        bookings,
        totalCount,
        totalPages,
        property_name: propertyDetail.title,
      });
  } catch (error) {
    console.error(error);
    return next(new apiError(500, `Server Error: ${error.message}`));
  }
};
