import { envVars } from "../../config/env";
import { ContactData } from "./contact.interface";
import nodemailer from "nodemailer";

const sendContactMailService = async (data: ContactData) => {
  const transporter = nodemailer.createTransport({
    host:  envVars.SMTP_HOST,
    port: Number(envVars.SMTP_PORT),
    secure: envVars.SMTP_SECURE === "true",
    auth: {
      user: envVars.SMTP_USER,
      pass: envVars.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"${data.name}" <${data.email}>`,
    to: envVars.SMTP_TO,
    subject: data.subject,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
    html: `<p><strong>Name:</strong> ${data.name}</p>
           <p><strong>Email:</strong> ${data.email}</p>
           
           <p>${data.message}</p>`,
  };
// <p><strong>Message:</strong></p>
  return transporter.sendMail(mailOptions);
};


export const contactServices = {
    sendContactMailService
}