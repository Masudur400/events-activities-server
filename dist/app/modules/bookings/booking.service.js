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
exports.bookingServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const user_model_1 = require("../user/user.model");
const booking_interface_1 = require("./booking.interface");
const http_status_1 = __importDefault(require("http-status"));
const booking_model_1 = require("./booking.model");
const payment_model_1 = require("../payments/payment.model");
const payment_interface_1 = require("../payments/payment.interface");
const getTransactionId_1 = require("../../utils/getTransactionId");
const event_model_1 = require("../events/event.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const mongoose_1 = require("mongoose");
const user_interface_1 = require("../user/user.interface");
const event_interface_1 = require("../events/event.interface");
// const createBooking = async (payload: Partial<IBooking>, userId: string) => {
//     const transactionId = getTransactionId()
//     const session = await Booking.startSession()
//     session.startTransaction()
//     try {
//         const user = await User.findById(userId)
//         if (!user?.phone || !user?.address) {
//             throw new AppError(httpStatus.BAD_REQUEST, 'Please update your profile to book a event.')
//         }
//         const event = await Event.findById(payload.event).select('joiningFee')
//         if (!event?.joiningFee) {
//             throw new AppError(httpStatus.BAD_REQUEST, 'No joiningFee found.')
//         }
//         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//         const amount = Number(event.joiningFee) * Number(payload.guestCount!)
//         const booking = await Booking.create([
//             {
//                 user: userId,
//                 status: BOOKING_STATUS.PENDING,
//                 ...payload
//             }
//         ], { session })
//         const payment = await Payment.create([
//             {
//                 booking: booking[0]._id,
//                 status: PAYMENT_STATUS.UNPAID,
//                 transactionId: transactionId,
//                 amount: amount,
//             }
//         ], { session })
//         const updatedBooking = await Booking.findByIdAndUpdate(
//             booking[0]._id,
//             { payment: payment[0]._id },
//             { new: true, runValidators: true, session }
//         ).populate("user", "name email phone address")
//             .populate("event", "eventName eventType joiningFee")
//             .populate("payment")
//         const userAddress = (updatedBooking?.user as any).address
//         const userEmail = (updatedBooking?.user as any).email
//         const userPhone = (updatedBooking?.user as any).phone
//         const userName = (updatedBooking?.user as any).name
//         const sslPayload: ISSLCommerz = {
//             address: userAddress,
//             email: userEmail,
//             phoneNumber: userPhone,
//             name: userName,
//             amount: amount,
//             transactionId: transactionId
//         }
//         const sslPayment = await SSLService.sslPaymentInit(sslPayload) 
//         console.log(sslPayment); 
//         await session.commitTransaction()
//         session.endSession()
//         return {
//             paymentUrl: sslPayment.GatewayPageURL,
//             booking:updatedBooking 
//         }
//     } catch (error) {
//         await session.abortTransaction()
//         session.endSession()
//         throw error
//     }
// }
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = (0, getTransactionId_1.getTransactionId)();
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!(user === null || user === void 0 ? void 0 : user.phone) || !(user === null || user === void 0 ? void 0 : user.address)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Please update your profile to book an event.');
        }
        const event = yield event_model_1.Event.findById(payload.event)
            .select('joiningFee bookedParticipants maxParticipants eventName status');
        if (!event) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Event not found.');
        }
        if (!event.joiningFee) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'No joiningFee found.');
        }
        // Prevent booking if event is FULL,CANCELED,COMPLETED
        if (event.status === event_interface_1.EventStatus.FULL) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Event ${event.eventName} is already FULL! No more booking allowed.`);
        }
        if (event.status === event_interface_1.EventStatus.CANCELED) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Event ${event.eventName} is already CANCELED! No more booking allowed.`);
        }
        if (event.status === event_interface_1.EventStatus.COMPLETED) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Event ${event.eventName} is already COMPLETED! No more booking allowed.`);
        }
        // If bookedParticipants already equals max
        if (event.bookedParticipants === event.maxParticipants) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Event ${event.eventName} is already fully booked!`);
        }
        // Guest count check
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const newBookedCount = Number(event.bookedParticipants) + Number(payload.guestCount);
        if (newBookedCount > event.maxParticipants) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Only ${event.maxParticipants - Number(event.bookedParticipants)} seats left!`);
        }
        // Calculate amount
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const amount = Number(event.joiningFee) * Number(payload.guestCount);
        // Create Booking
        const booking = yield booking_model_1.Booking.create([Object.assign({ user: userId, status: booking_interface_1.BOOKING_STATUS.PENDING }, payload)], { session });
        // Create Payment
        const payment = yield payment_model_1.Payment.create([{
                booking: booking[0]._id,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                transactionId: transactionId,
                amount: amount,
            }], { session });
        // Update booking with payment info
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(booking[0]._id, { payment: payment[0]._id }, { new: true, runValidators: true, session })
            .populate("user", "name email phone address")
            .populate("event", "eventName eventType joiningFee")
            .populate("payment");
        const userAddress = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).address;
        const userEmail = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).email;
        const userPhone = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).phone;
        const userName = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).name;
        const sslPayload = {
            address: userAddress,
            email: userEmail,
            phoneNumber: userPhone,
            name: userName,
            amount: amount,
            transactionId: transactionId
        };
        const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
        console.log(sslPayment);
        yield session.commitTransaction();
        session.endSession();
        return {
            paymentUrl: sslPayment.GatewayPageURL,
            booking: updatedBooking
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getAllBookings = (userRole_1, ...args_1) => __awaiter(void 0, [userRole_1, ...args_1], void 0, function* (userRole, page = 1, limit = 10) {
    if (![user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.HOST].includes(userRole)) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to access this resource");
    }
    const skip = (page - 1) * limit;
    const total = yield booking_model_1.Booking.countDocuments();
    const bookings = yield booking_model_1.Booking.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email")
        .populate("event", "eventName eventType joiningFee")
        .populate("payment");
    const meta = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
    return { meta, bookings };
});
const getUserBookings = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = yield booking_model_1.Booking.countDocuments({
        user: new mongoose_1.Types.ObjectId(userId),
    });
    const bookings = yield booking_model_1.Booking.find({
        user: new mongoose_1.Types.ObjectId(userId),
    })
        .sort({ createdAt: -1 }) // ✅ নতুনগুলো আগে
        .skip(skip)
        .limit(limit)
        .populate("user", "name email")
        .populate("event", "eventName eventType joiningFee")
        .populate("payment");
    const meta = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
    return { meta, bookings };
});
// const getSingleBooking = async (bookingId: string) => {
//   if (!Types.ObjectId.isValid(bookingId)) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking ID");
//   }
//   const booking = await Booking.findById(bookingId)
//     .populate("user", "name email")
//     .populate("event", "eventName eventType joiningFee")
//     .populate("payment");
//   if (!booking) {
//     throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
//   }
//   return booking;
// };
// const updateBookingStatus = async (bookingId: string, status: BOOKING_STATUS) => {
//   if (!Types.ObjectId.isValid(bookingId)) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking ID");
//   }
//   const booking = await Booking.findByIdAndUpdate(
//     bookingId,
//     { status },
//     { new: true, runValidators: true }
//   ).populate("user", "name email")
//     .populate("event", "eventName eventType joiningFee")
//     .populate("payment");
//   if (!booking) {
//     throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
//   }
//   return booking;
// };
exports.bookingServices = {
    createBooking,
    getAllBookings,
    getUserBookings,
    // getSingleBooking,
    // updateBookingStatus,
};
