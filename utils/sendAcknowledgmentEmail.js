import sendQueryContactEmail from "./sendQueryContactEmail.js";

export const sendAcknowledgmentEmail = async (senderEmail, senderName) => {
  try {
    // Acknowledgment email content
    const htmlContent = `
        <h3>Thank You for Connecting with Us</h3>
        <p>Dear ${senderName},</p>
        <p>Thank you for reaching out to us. We have received your query and will get back to you as soon as possible.</p>
        <p>If you have any urgent queries, feel free to contact us at <strong>${process.env.GMAIL}</strong>.</p>
        <br>
        <p>Best regards,</p>
        <p>Your Support Team</p>
      `;

    // Sending acknowledgment email
    const info = await sendQueryContactEmail(
      process.env.GMAIL,
      senderEmail,
      "Thanks for Connecting with Us",
      htmlContent
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
