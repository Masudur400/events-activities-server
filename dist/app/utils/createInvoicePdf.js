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
exports.createInvoicePdf = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const createInvoicePdf = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        const doc = new pdfkit_1.default({ margin: 50 });
        const chunks = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        // Title
        doc.fontSize(22).text("Event Booking Invoice", { align: "center" });
        doc.moveDown();
        // User Info
        doc.fontSize(14).text(`Customer Name: ${data.userName}`);
        doc.text(`Event Name: ${data.eventName}`);
        doc.text(`Booking Date: ${data.bookingDate.toDateString()}`);
        doc.text(`Guest Count: ${data.guestCount}`);
        doc.text(`Transaction ID: ${data.transactionId}`);
        doc.moveDown();
        // Amount
        doc.fontSize(16).text(`Total Amount: ${data.totalAmount} Taka`, {
            underline: true,
        });
        doc.moveDown();
        doc.text("Thank you for booking with us!", { align: "center" });
        doc.end();
    });
});
exports.createInvoicePdf = createInvoicePdf;
