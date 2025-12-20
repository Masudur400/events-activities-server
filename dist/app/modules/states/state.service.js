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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateService = void 0;
const booking_model_1 = require("../bookings/booking.model");
const event_model_1 = require("../events/event.model");
const payment_model_1 = require("../payments/payment.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const getAdminState = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const totalEvents = yield event_model_1.Event.countDocuments();
    const totalUsers = yield user_model_1.User.countDocuments({ role: user_interface_1.Role.USER });
    const totalHosts = yield user_model_1.User.countDocuments({ role: user_interface_1.Role.HOST });
    const totalSuperAdmin = yield user_model_1.User.countDocuments({ role: user_interface_1.Role.SUPER_ADMIN });
    const totalAdmin = yield user_model_1.User.countDocuments({ role: user_interface_1.Role.ADMIN });
    const totalUserCount = yield user_model_1.User.countDocuments();
    const totalPaymentCount = yield payment_model_1.Payment.countDocuments({ status: "PAID" });
    const totalPaidAmountAggregate = yield payment_model_1.Payment.aggregate([
        { $match: { status: "PAID" } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const totalPaidAmount = ((_a = totalPaidAmountAggregate[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0;
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
});
const getHostState = (hostId) => __awaiter(void 0, void 0, void 0, function* () {
    const hostEvents = yield event_model_1.Event.find({ hostId: hostId });
    const totalEvents = hostEvents.length;
    // collect eventIds
    const eventIds = hostEvents.map((e) => e._id);
    // Completed bookings
    const totalCompletedBookings = yield booking_model_1.Booking.countDocuments({
        event: { $in: eventIds },
        status: "COMPLETED",
    });
    // Payments
    const paidPayments = yield payment_model_1.Payment.find({ status: "PAID" }).populate({
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
});
const getUserState = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const totalBooking = yield booking_model_1.Booking.countDocuments({ user: userId });
    const paidPayments = yield payment_model_1.Payment.find({
        status: "PAID",
    }).populate({
        path: "booking",
        match: { user: userId },
        select: "_id",
    });
    const userPaidPayments = paidPayments.filter((p) => p.booking !== null);
    const totalPaymentCount = userPaidPayments.length;
    const totalPaymentAmount = userPaidPayments.reduce((sum, p) => sum + p.amount, 0);
    return {
        totalBooking,
        totalPaymentCount,
        totalPaymentAmount,
    };
});
exports.StateService = {
    getAdminState,
    getHostState,
    getUserState,
};
