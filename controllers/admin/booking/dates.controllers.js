import { BookedDatesModel } from "../../../models/BookedDates.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";

export const UpdateBookedDates = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    const { id } = req.params; 
    const { checkin_date, checkout_date } = req.body; 

    try {
        const isoCheckinDate = new Date(checkin_date).toISOString();
        const isoCheckoutDate = new Date(checkout_date).toISOString();

        const updatedDates = await BookedDatesModel.findByIdAndUpdate(
            id,
            { $set: { checkin_date: isoCheckinDate, checkout_date: isoCheckoutDate } },
            { new: true }
        );

        if (!updatedDates) {
            return res.status(404).json({ message: 'Booked dates not found' });
        }

        res.status(200).json(updatedDates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating booked dates', error });
    }
};


export const DeleteBookedDates = async (req, res, next) => {
    // #swagger.tags = ['Admin']
    const { id } = req.params;

    if (!id) {
        return next(new apiError(400, "ID not provided"))
    }

    try {
        const date = await BookedDatesModel.deleteOne(id);
        return res.status(200).json(new apiResponse(200, date, "Deleted Booked Date"));
    } catch (error) {
        return next(new apiError(500, `Server Error: ${error}`))
    }
}