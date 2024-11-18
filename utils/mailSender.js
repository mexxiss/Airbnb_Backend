import nodemailer from 'nodemailer'

export const mailSender = async (email, subject, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: email,
            subject: subject,
            html: body
        });

        return info;
    } catch (error) {
        // Return nothing as this would be considered as response received...
        console.error("Error encountered while sending OTP:", error);
        return { error: true, message: error.message };
    }
}