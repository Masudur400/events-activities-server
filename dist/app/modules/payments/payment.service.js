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
exports.PaymentService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const booking_model_1 = require("../bookings/booking.model");
const booking_interface_1 = require("../bookings/booking.interface");
const createInvoicePdf_1 = require("../../utils/createInvoicePdf");
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../../config/env");
const event_model_1 = require("../events/event.model");
const event_interface_1 = require("../events/event.interface");
const mongoose_1 = __importDefault(require("mongoose"));
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Payment Not Found. You have not booked this event");
    }
    const booking = yield booking_model_1.Booking.findById(payment.booking);
    const userAddress = (booking === null || booking === void 0 ? void 0 : booking.user).address;
    const userEmail = (booking === null || booking === void 0 ? void 0 : booking.user).email;
    const userPhoneNumber = (booking === null || booking === void 0 ? void 0 : booking.user).phone;
    const userName = (booking === null || booking === void 0 ? void 0 : booking.user).name;
    const sslPayload = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    };
    const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
    return {
        paymentUrl: sslPayment.GatewayPageURL
    };
});
// const successPayment = async (query: Record<string, string>) => {
//     const session = await Booking.startSession();
//     session.startTransaction(); 
//     try {
//         const updatedPayment = await Payment.findOneAndUpdate(
//             { transactionId: query.transactionId },
//             { status: PAYMENT_STATUS.PAID },
//             { new: true, runValidators: true, session }
//         );
//         if (!updatedPayment) {
//             throw new AppError(401, "Payment not found");
//         }
//         const updatedBooking = await Booking.findByIdAndUpdate(
//             updatedPayment.booking,
//             { status: BOOKING_STATUS.COMPLETE },
//             { new: true, runValidators: true, session }
//         )
//             .populate("event", "eventName")
//             .populate("user", "name email");
//         if (!updatedBooking) {
//             throw new AppError(401, "Booking not found");
//         }
//         // 1️⃣ Invoice Data
//         const invoiceData = {
//             bookingDate: updatedBooking.createdAt as Date,
//             guestCount: updatedBooking.guestCount,
//             totalAmount: updatedPayment.amount,
//             eventName: (updatedBooking.event as any).eventName,
//             transactionId: updatedPayment.transactionId,
//             userName: (updatedBooking.user as any).name,
//         };
//         // 2️⃣ Generate PDF Invoice
//         const pdfBuffer = await createInvoicePdf(invoiceData);
//         // 3️⃣ Upload to Cloudinary
//         const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice");
//         if (!cloudinaryResult) {
//             throw new AppError(401, "Error uploading pdf");
//         }
//         await Payment.findByIdAndUpdate(
//             updatedPayment._id,
//             { invoiceUrl: cloudinaryResult.secure_url },
//             { runValidators: true, session }
//         );
//         // 4️⃣ Send Confirmation Email via Nodemailer
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: envVars.SMTP_USER,
//                 pass: envVars.SMTP_PASS,
//             },
//         });
//         await transporter.sendMail({
//             from: `"Event Management" <${envVars.SMTP_USER}>`,
//             to: (updatedBooking.user as any).email,
//             subject: "Booking Payment Confirmation",
//             html: `
//                 <h2>Hello ${invoiceData.userName},</h2>
//                 <p>Your payment has been received successfully.</p>
//                 <p>Event: <strong>${invoiceData.eventName}</strong></p>
//                 <p>Transaction ID: <strong>${invoiceData.transactionId}</strong></p>
//                 <p>Guest Count: <strong>${invoiceData.guestCount}</strong></p>
//                 <br/>
//                 <p>Thank you for booking with us!</p>
//             `,
//             attachments: [
//                 {
//                     filename: "invoice.pdf",
//                     content: pdfBuffer,
//                     contentType: "application/pdf"
//                 }
//             ]
//         });
//         await session.commitTransaction();
//         session.endSession();
//         return { success: true, message: "Payment Completed Successfully" };
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         throw error;
//     }
// };
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.PAID }, { new: true, runValidators: true, session });
        if (!updatedPayment) {
            throw new AppError_1.default(401, "Payment not found");
        }
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment.booking, { status: booking_interface_1.BOOKING_STATUS.COMPLETE }, { new: true, runValidators: true, session })
            .populate("event")
            .populate("user", "name email");
        if (!updatedBooking) {
            throw new AppError_1.default(401, "Booking not found");
        }
        const event = updatedBooking.event;
        // If event.status is already FULL,CANCELED,COMPLETED → Block payment
        if (event.status === "FULL") {
            throw new AppError_1.default(400, "Event is already FULL. Payment cannot be processed.");
        }
        if (event.status === event_interface_1.EventStatus.CANCELED) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Event ${event.eventName} is already CANCELED! No more booking allowed.`);
        }
        if (event.status === event_interface_1.EventStatus.COMPLETED) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Event ${event.eventName} is already COMPLETED! No more booking allowed.`);
        }
        // If max capacity is already reached → Block payment + Set status FULL
        if (event.bookedParticipants === event.maxParticipants) {
            yield event_model_1.Event.findByIdAndUpdate(event._id, { status: "FULL" }, { session });
            throw new AppError_1.default(400, "Event is already fully booked!");
        }
        // Calculate new participants
        const newBookedParticipants = event.bookedParticipants + updatedBooking.guestCount;
        // If guest count exceeds max capacity → Block
        if (newBookedParticipants > event.maxParticipants) {
            throw new AppError_1.default(400, `Only ${event.maxParticipants - event.bookedParticipants} seats left!`);
        }
        // Update bookedParticipants
        const updatedEvent = yield event_model_1.Event.findByIdAndUpdate(event._id, {
            bookedParticipants: newBookedParticipants,
            status: newBookedParticipants === event.maxParticipants ? event_interface_1.EventStatus.FULL : event_interface_1.EventStatus.OPEN
        }, { new: true, session });
        if (!updatedEvent) {
            throw new AppError_1.default(400, "Event update failed!");
        }
        // Invoice Data
        const invoiceData = {
            bookingDate: updatedBooking.createdAt,
            guestCount: updatedBooking.guestCount,
            totalAmount: updatedPayment.amount,
            eventName: updatedEvent.eventName,
            transactionId: updatedPayment.transactionId,
            userName: updatedBooking.user.name,
        };
        // Generate Invoice PDF
        const pdfBuffer = yield (0, createInvoicePdf_1.createInvoicePdf)(invoiceData);
        // Upload Invoice
        const cloudinaryResult = yield (0, cloudinary_config_1.uploadBufferToCloudinary)(pdfBuffer, "invoice");
        if (!cloudinaryResult) {
            throw new AppError_1.default(401, "Error uploading pdf");
        }
        yield payment_model_1.Payment.findByIdAndUpdate(updatedPayment._id, { invoiceUrl: cloudinaryResult.secure_url }, { runValidators: true, session });
        // Send Email
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: { user: env_1.envVars.SMTP_USER, pass: env_1.envVars.SMTP_PASS },
        });
        yield transporter.sendMail({
            from: `"Event Management" <${env_1.envVars.SMTP_USER}>`,
            to: updatedBooking.user.email,
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
                    contentType: "application/pdf",
                },
            ],
        });
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment Completed Successfully" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.FAILED,
        }, { new: true, runValidators: true, session: session });
        yield booking_model_1.Booking
            .findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interface_1.BOOKING_STATUS.FAILED }, { runValidators: true, session });
        yield session.commitTransaction(); //transaction
        session.endSession();
        return { success: false, message: "Payment Failed" };
    }
    catch (error) {
        yield session.abortTransaction(); // rollback
        session.endSession();
        // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
        throw error;
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.CANCELED,
        }, { runValidators: true, session: session });
        yield booking_model_1.Booking
            .findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interface_1.BOOKING_STATUS.CANCEL }, { runValidators: true, session });
        yield session.commitTransaction(); //transaction
        session.endSession();
        return { success: false, message: "Payment Cancelled" };
    }
    catch (error) {
        yield session.abortTransaction(); // rollback
        session.endSession();
        // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
        throw error;
    }
});
const getInvoiceDownloadUrl = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(paymentId)
        .select("invoiceUrl");
    if (!payment) {
        throw new AppError_1.default(401, "Payment not found");
    }
    if (!payment.invoiceUrl) {
        throw new AppError_1.default(401, "No invoice found");
    }
    return payment.invoiceUrl;
});
const getMyPayments = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { page = "1", limit = "10" } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    // Aggregate payments where booking.user = userId & status = "PAID"
    const paymentsAggregate = payment_model_1.Payment.aggregate([
        {
            $match: { status: "PAID" }
        },
        {
            $lookup: {
                from: "bookings", // Booking collection
                localField: "booking",
                foreignField: "_id",
                as: "booking"
            }
        },
        { $unwind: "$booking" },
        { $match: { "booking.user": new mongoose_1.default.Types.ObjectId(userId) } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum }
    ]);
    // Total count for pagination
    const totalAggregate = payment_model_1.Payment.aggregate([
        { $match: { status: "PAID" } },
        {
            $lookup: {
                from: "bookings",
                localField: "booking",
                foreignField: "_id",
                as: "booking"
            }
        },
        { $unwind: "$booking" },
        { $match: { "booking.user": new mongoose_1.default.Types.ObjectId(userId) } },
        { $count: "total" }
    ]);
    const [payments, totalResult] = yield Promise.all([
        paymentsAggregate.exec(),
        totalAggregate.exec()
    ]);
    const total = ((_a = totalResult[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    const totalPages = Math.ceil(total / limitNum);
    const meta = {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages
    };
    return { meta, data: payments };
});
;
const getAllPayments = (filters, pagination) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = filters;
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const query = {};
    // status filter
    if (status) {
        query.status = status;
    }
    // count total documents
    const total = yield payment_model_1.Payment.countDocuments(query);
    // main query
    const data = yield payment_model_1.Payment.find(query)
        .populate({
        path: "booking",
        select: "userId title amount", // optional: booking theke info nile
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const meta = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
    return {
        meta,
        data
    };
});
exports.PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    getInvoiceDownloadUrl,
    getMyPayments,
    getAllPayments
};
