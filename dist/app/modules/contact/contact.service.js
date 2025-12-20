"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactServices = void 0;
const env_1 = require("../../config/env");
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendContactMailService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: env_1.envVars.SMTP_HOST,
        port: Number(env_1.envVars.SMTP_PORT),
        secure: env_1.envVars.SMTP_SECURE === "true",
        auth: {
            user: env_1.envVars.SMTP_USER,
            pass: env_1.envVars.SMTP_PASS,
        },
    });
    const mailOptions = {
        from: `"${data.name}" <${data.email}>`,
        to: env_1.envVars.SMTP_TO,
        subject: data.subject,
        text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
        html: `<p><strong>Name:</strong> ${data.name}</p>
           <p><strong>Email:</strong> ${data.email}</p>
           
           <p>${data.message}</p>`,
    };
    // <p><strong>Message:</strong></p>
    return transporter.sendMail(mailOptions);
});
exports.contactServices = {
    sendContactMailService
};
