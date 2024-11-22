import nodemailer from "nodemailer";

// Email sending function with HTML support
const sendQueryContactEmail = async (
  fromEmail,
  toEmail,
  subject,
  htmlToSend
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Secure port
      secure: true, // Use SSL
      auth: {
        user: process.env.GMAIL, // Email address from .env file
        pass: process.env.G_PASS, // Password or App password from .env file
      },
    });

    const mailOptions = {
      from: fromEmail, // Sender email address
      to: toEmail, // Recipient email address
      subject: subject, // Email subject
      html: htmlToSend, // HTML content
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: true, message: error.message };
  }
};

export default sendQueryContactEmail;
