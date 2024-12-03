import nodemailer from 'nodemailer';
import fs from 'fs/promises';

export const mailSender = async (email, subject, replacements) => {
    try {
        let html = await fs.readFile("public/thankyou.html", "utf-8");

        Object.keys(replacements).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, "g");
            html = html.replace(regex, replacements[key]);
        });
        
        console.log(email)

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
            html: html 
        });

        return info;
    } catch (error) {
        console.error("Error encountered while sending email:", error);
        return { error: true, message: error.message };
    }
};
