import { ContactUsModel } from "../models/ContactUs.js";
import SendQuery from "../models/SendContactQuery.js";
import { mailSender } from "../utils/mailSender.js";
import { sendAcknowledgmentEmail } from "../utils/sendAcknowledgmentEmail.js";
import sendQueryContactEmail from "../utils/sendQueryContactEmail.js";

export const createContactus = async (req, res) => {
  // #swagger.tags = ['General']
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
  // #swagger.tags = ['General']
  try {
    const contacts = await ContactUsModel.find();
    res.status(200).json({
      success: true,
      data: contacts[0]._doc,
      msg: "contacts fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendContactQuery = async (req, res) => {
  // #swagger.tags = ['General']
  try {
    const { fullname, email, phone, subject, message } = req.body;

    if (!fullname || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const emailSubject = `${subject}`;
    const recipientEmail = process.env.GMAIL; // Admin email where the queries should be sent

    const replacements = {
      title: "Received new Query!",
      text: `Congratulations, you have received a new query from ${fullname}. Here is the contact information provided.`,
      moreDetails: `<p><strong>Name:</strong> ${fullname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>`,
    };

    const acknowledgeReplacements = {
      title: "Mexxiss has received your Query",
      text: `Dear ${fullname}, thank you for reaching out to us. We have received your query and will respond shortly.`,
      moreDetails: `<p>If you have any urgent concerns, feel free to reply to this email.</p>`,
    };

    await Promise.all([
      mailSender(process.env.MAIL_FROM, emailSubject, replacements),
      mailSender(email, "Thanks for contacting us", acknowledgeReplacements),
    ]);

    const sendQuery = new SendQuery(req.body);
    await sendQuery.save();

    res.status(200).json({
      success: true,
      message: "Your query has been submitted successfully.",
    });
  } catch (error) {
    console.error("Error in /contact route:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const updateContactUs = async (req, res) => {
  // #swagger.tags = ['Admin']
  try {
    const allowedItems = ["emails", "phones", "location"];

    const updates = Object.keys(req.body).filter((key) =>
      allowedItems.includes(key)
    );

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    const contact = await ContactUsModel.findById(req?.params?.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact details not found.",
      });
    }

    updates.forEach((key) => {
      // Handle nested updates for location
      if (key === "location" && typeof req.body.location === "object") {
        contact.location = {
          ...contact.location,
          ...req.body.location,
        };
      } else {
        contact[key] = req.body[key];
      }
    });

    const updatedContact = await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact details updated successfully.",
      data: updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact details:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
