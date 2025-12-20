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
exports.bookingControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const booking_service_1 = require("./booking.service");
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const createBooking = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const booking = yield booking_service_1.bookingServices.createBooking(req.body, userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Booking Created Successfully",
        data: booking,
    });
}));
const getAllBookings = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    if (!userRole) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User role not found");
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = yield booking_service_1.bookingServices.getAllBookings(userRole, page, limit);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All Bookings Retrieved Successfully",
        data: result.bookings,
    });
}));
const getUserBookings = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId)
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User not found");
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = yield booking_service_1.bookingServices.getUserBookings(userId, page, limit);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User Bookings Retrieved Successfully",
        data: result,
    });
}));
// const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
//   const bookingId = req.params.bookingId;
//   const booking = await bookingServices.getSingleBooking(bookingId);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Booking Retrieved Successfully",
//     data: booking,
//   });
// });
// const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
//   const bookingId = req.params.bookingId;
//   const { status } = req.body;
//   const booking = await bookingServices.updateBookingStatus(bookingId, status);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Booking Status Updated Successfully",
//     data: booking,
//   });
// });
exports.bookingControllers = {
    createBooking,
    getAllBookings,
    getUserBookings,
    // getSingleBooking,
    // updateBookingStatus,
};
