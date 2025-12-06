 
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config"; 
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service"; 
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import AppError from "../../errorHandler/AppError";
import { Booking } from "../bookings/booking.model";
import { BOOKING_STATUS } from "../bookings/booking.interface"; 
import { createInvoicePdf } from "../../utils/createInvoicePdf";
import nodemailer from "nodemailer";
import { envVars } from "../../config/env";



const initPayment = async (bookingId: string) => { 
    const payment = await Payment.findOne({ booking: bookingId }) 
    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found. You have not booked this event")
    } 
    const booking = await Booking.findById(payment.booking)

    const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userPhoneNumber = (booking?.user as any).phone
    const userName = (booking?.user as any).name

    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    } 
    const sslPayment = await SSLService.sslPaymentInit(sslPayload) 
    return {
        paymentUrl: sslPayment.GatewayPageURL
    } 
};


 

const successPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction(); 

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.PAID },
            { new: true, runValidators: true, session }
        );

        if (!updatedPayment) {
            throw new AppError(401, "Payment not found");
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            updatedPayment.booking,
            { status: BOOKING_STATUS.COMPLETE },
            { new: true, runValidators: true, session }
        )
            .populate("event", "eventName")
            .populate("user", "name email");

        if (!updatedBooking) {
            throw new AppError(401, "Booking not found");
        }

        // 1️⃣ Invoice Data
        const invoiceData = {
            bookingDate: updatedBooking.createdAt as Date,
            guestCount: updatedBooking.guestCount,
            totalAmount: updatedPayment.amount,
            eventName: (updatedBooking.event as any).eventName,
            transactionId: updatedPayment.transactionId,
            userName: (updatedBooking.user as any).name,
        };

        // 2️⃣ Generate PDF Invoice
        const pdfBuffer = await createInvoicePdf(invoiceData);

        // 3️⃣ Upload to Cloudinary
        const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice");

        if (!cloudinaryResult) {
            throw new AppError(401, "Error uploading pdf");
        }

        await Payment.findByIdAndUpdate(
            updatedPayment._id,
            { invoiceUrl: cloudinaryResult.secure_url },
            { runValidators: true, session }
        );

        // 4️⃣ Send Confirmation Email via Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: envVars.SMTP_USER,
                pass: envVars.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Event Management" <${envVars.SMTP_USER}>`,
            to: (updatedBooking.user as any).email,
            subject: "Booking Payment Confirmation",
            html: `
                <h2>Hello ${invoiceData.userName},</h2>
                <p>Your payment has been received successfully.</p>
                <p>Event: <strong>${invoiceData.eventName}</strong></p>
                <p>Transaction ID: <strong>${invoiceData.transactionId}</strong></p>
                <p>Guest Count: <strong>${invoiceData.guestCount}</strong></p>
                <br/>
                <p>Thank you for booking with us!</p>
            `,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        });

        await session.commitTransaction();
        session.endSession();

        return { success: true, message: "Payment Completed Successfully" };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};





const failPayment = async (query: Record<string, string>) => {  
    const session = await Booking.startSession();
    session.startTransaction() 
    try {
 
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.FAILED,
        }, { new: true, runValidators: true, session: session })

        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.FAILED },
                { runValidators: true, session }
            )

        await session.commitTransaction(); //transaction
        session.endSession()
        return { success: false, message: "Payment Failed" }
    } catch (error) {
        await session.abortTransaction(); // rollback
        session.endSession()
        // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
        throw error
    }
};




const cancelPayment = async (query: Record<string, string>) => { 
    const session = await Booking.startSession();
    session.startTransaction() 
    try { 
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.CANCELED,
        }, { runValidators: true, session: session }) 
        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.CANCEL },
                { runValidators: true, session }
            )

        await session.commitTransaction(); //transaction
        session.endSession()
        return { success: false, message: "Payment Cancelled" }
    } catch (error) {
        await session.abortTransaction(); // rollback
        session.endSession()
        // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
        throw error
    }
};





const getInvoiceDownloadUrl = async (paymentId: string) => {
    const payment = await Payment.findById(paymentId)
        .select("invoiceUrl") 
    if (!payment) {
        throw new AppError(401, "Payment not found")
    }  
    if (!payment.invoiceUrl) {
        throw new AppError(401, "No invoice found")
    } 
    return payment.invoiceUrl
};


export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    getInvoiceDownloadUrl
};