import { mailSender } from "./mailSender.js";
import sendQueryContactEmail from "./sendQueryContactEmail.js";

export const sendAcknowledgmentEmail = async (senderEmail, senderName) => {
  try {
    // Acknowledgment email content
    const replacements = {
      title: "Mexxiss has received your Query",
      text: `Dear ${senderName}, thank you for reaching out to us. We have received your query and will respond shortly.`,
      moreDetails: `<p>If you have any urgent concerns, feel free to reply to this email.</p>`,
    };

    // Sending acknowledgment email
    const info = await mailSender(
      senderEmail,
      "Thanks for Connecting with Us",
      replacements
    );

    return {
      success: true,
      message: "Acknowledgment email sent successfully",
      info,
    };
  } catch (error) {
    console.error("Error sending acknowledgment email:", error);
    return {
      success: false,
      message: "Failed to send acknowledgment email",
      error,
    };
  }
};
