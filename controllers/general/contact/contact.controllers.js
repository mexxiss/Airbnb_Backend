import { ContactUsModel } from "../../../models/ContactUs.js";
import SendQuery from "../../../models/SendContactQuery.js";
import { mailSender } from "../../../utils/mailSender.js";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const getContactus = async (req, res) => {
  // #swagger.tags = ['General']
  // #swagger.summary = 'Endpoint to get company contact details to map on website's UI'
  // #swagger.description = '> #TODO: Retrieved contact details of the company may contain non-required information.'

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
  // #swagger.summary = 'Endpoint to send contact query to the company. This will send an email to the company and an acknowledgment email to the user.'

  try {
    const { fullname, email, phone, subject, message } = req.body;

    if (!fullname || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const formattedPhone = '+'+phone;

    // Create the document
    const sendQuery = await SendQuery.create({
      fullname,
      email,
      phone: formattedPhone,
      subject,
      message,
    });

    await sendQuery.validate();

    // Prepare email content
    const emailSubject = `${subject}`;
    const recipientEmail = process.env.GMAIL; // Admin email where the queries should be sent

    const replacements = {
      title: "Received new Query!",
      text: `Congratulations, you have received a new query from ${fullname}. Here is the contact information provided.`,
      moreDetails: `<p><strong>Name:</strong> ${fullname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${formattedPhone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>`,
    };

    const acknowledgeReplacements = {
      title: "Mexxiss has received your Query",
      text: `Dear ${fullname}, thank you for reaching out to us. We have received your query and will respond shortly.`,
      moreDetails: `<p>If you have any urgent concerns, feel free to reply to this email.</p>`,
    };

    // Send emails
    await Promise.all([
      mailSender(process.env.MAIL_FROM, emailSubject, replacements),
      mailSender(email, "Thanks for contacting us", acknowledgeReplacements),
    ]);

    res.status(200).json({
      success: true,
      message: "Your query has been submitted successfully.",
    });
  } catch (error) {

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed. Please check your input.",
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
