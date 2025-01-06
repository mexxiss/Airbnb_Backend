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
    const invoices = await Furnishing.find({}).populate("bank_details");

    res.status(200).json({
      message: "Furnishing Invoices fetched successfully",
      data: invoices,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
