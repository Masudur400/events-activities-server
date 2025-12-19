/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import AppError from "../../errorHandler/AppError"
import { User } from "../user/user.model"
import { BOOKING_STATUS, IBooking } from "./booking.interface"
import httpStatus from 'http-status'
import { Booking } from "./booking.model"
import { Payment } from "../payments/payment.model"
import { PAYMENT_STATUS } from "../payments/payment.interface"
import { getTransactionId } from "../../utils/getTransactionId"
import { Event } from "../events/event.model"
import { SSLService } from "../sslCommerz/sslCommerz.service"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface"
import { Types } from "mongoose"
import { Role } from "../user/user.interface"
import { EventStatus } from "../events/event.interface"




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





const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);
    if (!user?.phone || !user?.address) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Please update your profile to book an event.');
    }

    const event = await Event.findById(payload.event)
      .select('joiningFee bookedParticipants maxParticipants eventName status');

    if (!event) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Event not found.');
    }

    if (!event.joiningFee) {
      throw new AppError(httpStatus.BAD_REQUEST, 'No joiningFee found.');
    }

    // Prevent booking if event is FULL,CANCELED,COMPLETED
    if (event.status === EventStatus.FULL) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Event ${event.eventName} is already FULL! No more booking allowed.`
      );
    }
    if (event.status === EventStatus.CANCELED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Event ${event.eventName} is already CANCELED! No more booking allowed.`
      );
    }
    if (event.status === EventStatus.COMPLETED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Event ${event.eventName} is already COMPLETED! No more booking allowed.`
      );
    }

    // If bookedParticipants already equals max
    if (event.bookedParticipants === event.maxParticipants) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Event ${event.eventName} is already fully booked!`
      );
    }

    // Guest count check
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newBookedCount = Number(event.bookedParticipants) + Number(payload.guestCount!);

    if (newBookedCount > event.maxParticipants) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Only ${event.maxParticipants - Number(event.bookedParticipants)} seats left!`
      );
    }

    // Calculate amount
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = Number(event.joiningFee) * Number(payload.guestCount!);

    // Create Booking
    const booking = await Booking.create([{
      user: userId,
      status: BOOKING_STATUS.PENDING,
      ...payload
    }], { session });

    // Create Payment
    const payment = await Payment.create([{
      booking: booking[0]._id,
      status: PAYMENT_STATUS.UNPAID,
      transactionId: transactionId,
      amount: amount,
    }], { session });

    // Update booking with payment info
    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("event", "eventName eventType joiningFee")
      .populate("payment");

    const userAddress = (updatedBooking?.user as any).address;
    const userEmail = (updatedBooking?.user as any).email;
    const userPhone = (updatedBooking?.user as any).phone;
    const userName = (updatedBooking?.user as any).name;

    const sslPayload: ISSLCommerz = {
      address: userAddress,
      email: userEmail,
      phoneNumber: userPhone,
      name: userName,
      amount: amount,
      transactionId: transactionId
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);
    console.log(sslPayment);

    await session.commitTransaction();
    session.endSession();

    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking
    };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};










const getAllBookings = async (userRole: string, page = 1, limit = 10) => {
  if (![Role.ADMIN, Role.SUPER_ADMIN, Role.HOST].includes(userRole as Role)) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to access this resource");
  }

  const skip = (page - 1) * limit;

  const total = await Booking.countDocuments();

  const bookings = await Booking.find()
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
};




const getUserBookings = async (userId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit; 
  const total = await Booking.countDocuments({ user: new Types.ObjectId(userId) }); 
  const bookings = await Booking.find({ user: new Types.ObjectId(userId) })
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
};



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



export const bookingServices = {
  createBooking,
  getAllBookings,
  getUserBookings,
  // getSingleBooking,
  // updateBookingStatus,
}