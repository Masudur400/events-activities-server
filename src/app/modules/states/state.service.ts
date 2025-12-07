 
import { Booking } from "../bookings/booking.model";
import { Event } from "../events/event.model";
import { Payment } from "../payments/payment.model";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";

const getAdminState = async () => {
  const totalEvents = await Event.countDocuments();
  const totalUsers = await User.countDocuments({ role: Role.USER });
  const totalHosts = await User.countDocuments({ role: Role.HOST });
  const totalSuperAdmin = await User.countDocuments({ role: Role.SUPER_ADMIN });
  const totalAdmin = await User.countDocuments({ role: Role.ADMIN });
  const totalUserCount = await User.countDocuments(); // all users
  const totalPaymentCount = await Payment.countDocuments({ status: "PAID" });

  const totalPaidAmountAggregate = await Payment.aggregate([
    { $match: { status: "PAID" } },
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
  ]);

  const totalPaidAmount = totalPaidAmountAggregate[0]?.totalAmount || 0;

  return {
    totalEvents,
    totalUsers,
    totalHosts,
    totalAdmin,
    totalSuperAdmin,
    totalUserCount,
    totalPaymentCount,
    totalPaidAmount,
  };
};




const getHostState = async (hostId: string) => { 
  const hostEvents = await Event.find({ hostId: hostId });  
  const totalEvents = hostEvents.length; 
  // collect eventIds
  const eventIds = hostEvents.map((e) => e._id); 
  // Completed bookings
  const totalCompletedBookings = await Booking.countDocuments({
    event: { $in: eventIds },
    status: "COMPLETED",
  }); 
  // Payments
  const paidPayments = await Payment.find({ status: "PAID" }).populate({
    path: "booking",
    match: { event: { $in: eventIds } },
    select: "_id event amount",
  }); 
  // filter null bookings
  const filtered = paidPayments.filter((p) => p.booking !== null); 
  return {
    totalEvents,
    totalCompletedBookings,
    totalPaymentCount: filtered.length,
    totalPaymentAmount: filtered.reduce((sum, p) => sum + p.amount, 0),
  };
};




const getUserState = async (userId: string) => {
  // user bookings
  const totalBooking = await Booking.countDocuments({ user: userId });

  // user PAID payments
  const paidPayments = await Payment.find({
    status: "PAID",
  }).populate({
    path: "booking",
    match: { user: userId },
    select: "_id",
  });

  const userPaidPayments = paidPayments.filter((p) => p.booking !== null);

  const totalPaymentCount = userPaidPayments.length;

  const totalPaymentAmount = userPaidPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  return {
    totalBooking,
    totalPaymentCount,
    totalPaymentAmount,
  };
};

export const StateService = {
  getAdminState,
  getHostState,
  getUserState,
};
