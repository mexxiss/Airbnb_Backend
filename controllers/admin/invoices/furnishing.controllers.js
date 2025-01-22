import { Furnishing } from "../../../models/Invoices.js";

export const createFurnishingInvoice = async (req, res) => {
  try {
    const existingFurnishingInvoice = await Furnishing.findOne({
      statementPeriod: req.body.statementPeriod,
      property_id: req.body.property_id,
    });

    if (existingFurnishingInvoice) {
      return res
        .status(400)
        .json({ message: "Furnishing Invoice already exists" });
    }

    const furnishing = new Furnishing(req.body);
    await furnishing.save();

    res.status(201).json({
      message: "Furnishing Invoice Created Successfully",
      data: furnishing,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateFurnishingInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFurnishing = await Furnishing.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedFurnishing) {
      return res.status(404).json({ error: "Furnishing not found" });
    }
    res.status(200).json({
      message: "Furnishing Invoice updated successfully",
      data: updatedFurnishing,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllFurnishingInvoice = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { invoiceNumber: { $regex: search, $options: "i" } },
          { statementPeriod: { $regex: search, $options: "i" } },
          { "companyDetails.name": { $regex: search, $options: "i" } },
          { "companyDetails.address": { $regex: search, $options: "i" } },
          { "companyDetails.phone": { $regex: search, $options: "i" } },
          { "ownerDetails.name": { $regex: search, $options: "i" } },
          { "ownerDetails.address": { $regex: search, $options: "i" } },
          { "ownerDetails.phone": { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
          { furnishingDetails: { $regex: search, $options: "i" } },
          { notes: { $regex: search, $options: "i" } },
        ],
      };

      if (!isNaN(search)) {
        const searchNumber = Number(search);

        query.$or.push(
          { totalFurnishingCost: { $gte: searchNumber } },
          { receivedAmount: { $gte: searchNumber } },
          { amountOwedToFP: { $gte: searchNumber } }
        );
      }
    }

    const invoices = await Furnishing.find(query).populate("bank_details");

    res.status(200).json({
      message: "Furnishing Invoices fetched successfully",
      data: invoices,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getFurnishingInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const furnishing = await Furnishing.findById(id)
      .populate("bank_details")
      .populate({
        path: "property_id",
        select: "title user",
      });
    if (!furnishing) {
      return res.status(404).json({ error: "Furnishing not found" });
    }
    res.status(200).json({
      message: "Furnishing Fetch successfully",
      data: furnishing,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
