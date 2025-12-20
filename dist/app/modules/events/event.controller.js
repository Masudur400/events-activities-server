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
exports.eventControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const event_service_1 = require("./event.service");
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const createEvent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const hostId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!hostId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized user!");
    }
    if (req.user.role !== "HOST") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Only HOST can create events!");
    }
    const payload = Object.assign(Object.assign({}, req.body), { hostId, image: (_b = req.file) === null || _b === void 0 ? void 0 : _b.path });
    const result = yield event_service_1.EventServices.createEvent(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Event Created Successfully",
        data: result,
    });
}));
const getEventTypes = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventTypes = yield event_service_1.EventServices.getAllEventTypes();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Event types fetched successfully",
        data: eventTypes,
    });
}));
const getMyEvents = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const hostId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!hostId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Host ID is required!");
    }
    const result = yield event_service_1.EventServices.getMyEvents(hostId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Your events retrieved successfully",
        data: result,
    });
}));
const getAllEvents = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield event_service_1.EventServices.getAllEvents(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Events retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleEvent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = req.params.id;
    const result = yield event_service_1.EventServices.getSingleEvent(eventId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Event Retrieved Successfully",
        data: result,
    });
}));
const deleteEvent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = req.params.id;
    const result = yield event_service_1.EventServices.deleteEvent(eventId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: result.message,
        data: null
    });
}));
const deleteMyEvent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const eventId = req.params.id;
    // ✅ Pass logged-in host ID to service
    const result = yield event_service_1.EventServices.deleteMyEvent(eventId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: result.message,
        data: null,
    });
}));
const updateEvent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const eventId = req.params.id;
    let payload = {};
    // Form-data: baki field gula JSON string pathabe
    if (req.body.data) {
        try {
            payload = JSON.parse(req.body.data);
        }
        catch (error) {
            throw new Error("Invalid JSON format in 'data' field");
        }
    }
    // Form-data: image file
    if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) {
        payload.image = req.file.path;
    }
    const updatedEvent = yield event_service_1.EventServices.updateEvent(eventId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Event updated successfully",
        data: updatedEvent,
    });
}));
const updateMyEvent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const eventId = req.params.id;
    let payload = {};
    if (req.body.data) {
        try {
            payload = JSON.parse(req.body.data);
        }
        catch (error) {
            throw new Error("Invalid JSON format in 'data' field");
        }
    }
    if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) {
        payload.image = req.file.path;
    }
    // Pass logged-in host ID to service
    const updatedEvent = yield event_service_1.EventServices.updateMyEvent(eventId, payload, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Event updated successfully",
        data: updatedEvent,
    });
}));
exports.eventControllers = {
    createEvent,
    getEventTypes,
    getMyEvents,
    getAllEvents,
    getSingleEvent,
    deleteEvent,
    deleteMyEvent,
    updateEvent,
    updateMyEvent
};
