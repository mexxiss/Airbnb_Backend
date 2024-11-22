import { ContactUsModel } from "../models/ContactUs.js";

export const createContactus = async (req, res) => {
  try {
    const contact = new ContactUsModel(req.body);
    const savedContact = await contact.save();
    res.status(201).json({
      success: true,
      data: savedContact,
      msg: "contact created successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getContactus = async (req, res) => {
  try {
    const contacts = await ContactUsModel.find();
    res.status(200).json({
      success: true,
      data: contacts[0]._doc,
      msg: "contacts featched successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
