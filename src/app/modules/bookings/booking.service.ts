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




const createBooking = async (payload: Partial<IBooking>, userId: string) => { 
    const transactionId = getTransactionId() 
    const session = await Booking.startSession()
    session.startTransaction() 
    try { 
        const user = await User.findById(userId)
        if (!user?.phone || !user?.address) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Please update your profile to book a event.')
        } 
        const event = await Event.findById(payload.event).select('joiningFee')
        if (!event?.joiningFee) {
            throw new AppError(httpStatus.BAD_REQUEST, 'No joiningFee found.')
        } 
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const amount = Number(event.joiningFee) * Number(payload.guestCount!) 
        const booking = await Booking.create([
            {
                user: userId,
                status: BOOKING_STATUS.PENDING,
                ...payload
            }
        ], { session }) 
        const payment = await Payment.create([
            {
                booking: booking[0]._id,
                status: PAYMENT_STATUS.UNPAID,
                transactionId: transactionId,
                amount: amount,
            }
        ], { session })  
        const updatedBooking = await Booking.findByIdAndUpdate(
            booking[0]._id,
            { payment: payment[0]._id },
            { new: true, runValidators: true, session }
        ).populate("user", "name email phone address")
            .populate("event", "eventName eventType joiningFee")
            .populate("payment")  
        await session.commitTransaction()
        session.endSession()
        return updatedBooking 
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}




const getAllBookings = async () => {
    return {}
}




const getUserBookings = async () => {
    return {}
}




const getSingleBooking = async () => {
    return {}
}




const updateBookingStatus = async () => {
    return {}
}



export const bookingServices = {
    createBooking,
    getAllBookings,
    getUserBookings,
    getSingleBooking,
    updateBookingStatus,
}