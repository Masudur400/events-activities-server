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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const event_model_1 = require("./event.model");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const queryBuilder_1 = require("../../utils/queryBuilder");
const event_constents_1 = require("./event.constents");
const createEvent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventName, eventType, hostId, date, startTime, endTime, minParticipants, maxParticipants, joiningFee } = payload, rest = __rest(payload, ["eventName", "eventType", "hostId", "date", "startTime", "endTime", "minParticipants", "maxParticipants", "joiningFee"]);
    if (!hostId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Host ID is required!");
    }
    // Required Fields Validation
    if (!eventName)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Event name is required!");
    if (!eventType)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Event type is required!");
    if (!date)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Event date is required!");
    if (!startTime)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Start time is required!");
    if (!endTime)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "End time is required!");
    if (minParticipants === undefined)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Minimum participants required!");
    if (maxParticipants === undefined)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Maximum participants required!");
    if (joiningFee === undefined)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Joining fee is required!");
    // Convert string numbers to actual numbers
    const minPart = Number(minParticipants);
    const maxPart = Number(maxParticipants);
    const fee = Number(joiningFee);
    // Convert date from frontend (calendar input)
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid date format!");
    }
    const event = yield event_model_1.Event.create(Object.assign({ eventName,
        eventType,
        hostId, date: eventDate, startTime,
        endTime, minParticipants: minPart, maxParticipants: maxPart, joiningFee: fee }, rest));
    return event;
});
const getAllEventTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    const types = yield event_model_1.Event.distinct("eventType");
    if (!types || types.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No event types found!");
    }
    return types;
});
const getMyEvents = (hostId, query) => __awaiter(void 0, void 0, void 0, function* () {
    if (!hostId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Host ID is required!");
    }
    const { searchTerm, sortBy, sortOrder, page = "1", limit = "10" } = query, filters = __rest(query, ["searchTerm", "sortBy", "sortOrder", "page", "limit"]);
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    // Base filter: only host's events
    const baseFilter = { hostId };
    // Search by searchTerm
    if (searchTerm) {
        const searchRegex = new RegExp(searchTerm, "i"); // case-insensitive
        baseFilter.$or = event_constents_1.eventSearchableFields.map((field) => ({
            [field]: searchRegex,
        }));
    }
    // Additional filters
    Object.keys(filters).forEach((key) => {
        baseFilter[key] = filters[key];
    });
    //  Sort
    let sortOption = { createdAt: -1 }; // default newest first
    if (sortBy) {
        sortOption = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    }
    // Fetch events with pagination
    const events = yield event_model_1.Event.find(baseFilter)
        .populate({ path: "hostId", select: "-password -auths" })
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum);
    // Total count for meta
    const total = yield event_model_1.Event.countDocuments(baseFilter);
    const totalPages = Math.ceil(total / limitNum);
    const meta = {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
    };
    return { meta, data: events };
});
const getAllEvents = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(event_model_1.Event.find().populate({
        path: "hostId",
        select: "-password -auths"
    }), query)
        // search, filter, sort, e.g 
        .search(event_constents_1.eventSearchableFields)
        .filter()
        .sort()
        .fields()
        .pagination();
    const [data, meta] = yield Promise.all([queryBuilder.build(), queryBuilder.getMeta()]);
    return { data, meta };
});
const getSingleEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.Event.findById(eventId)
        .populate({
        path: "hostId",
        select: "-password -auths",
    });
    if (!event) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Event not found");
    }
    return event;
});
const deleteEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.Event.findById(eventId);
    if (!event) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Event not found");
    }
    // Delete event image from Cloudinary if exists
    if (event.image) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(event.image);
    }
    // Delete event from DB
    yield event_model_1.Event.findByIdAndDelete(eventId);
    return { message: "Event deleted successfully" };
});
const deleteMyEvent = (eventId, hostId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.Event.findById(eventId);
    if (!event) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Event not found");
    }
    // ✅ Only host who created the event can delete
    if (event.hostId.toString() !== hostId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You can only delete your own events");
    }
    // Delete event image from Cloudinary if exists
    if (event.image) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(event.image);
    }
    // Delete event from DB
    yield event_model_1.Event.findByIdAndDelete(eventId);
    return { message: "Event deleted successfully" };
});
const updateEvent = (eventId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.Event.findById(eventId);
    if (!event) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Event not found");
    }
    // আগের image থাকলে এবং নতুন image path আসলে delete করো
    if (payload.image && event.image) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(event.image);
    }
    // Number/String conversion
    if (payload.minParticipants) {
        payload.minParticipants =
            typeof payload.minParticipants === "string"
                ? Number(payload.minParticipants)
                : payload.minParticipants;
    }
    if (payload.maxParticipants) {
        payload.maxParticipants =
            typeof payload.maxParticipants === "string"
                ? Number(payload.maxParticipants)
                : payload.maxParticipants;
    }
    if (payload.joiningFee) {
        payload.joiningFee =
            typeof payload.joiningFee === "string"
                ? Number(payload.joiningFee)
                : payload.joiningFee;
    }
    // Date conversion
    if (payload.date) {
        payload.date = new Date(payload.date);
    }
    // Update event with payload
    Object.assign(event, payload);
    yield event.save();
    return event;
});
const updateMyEvent = (eventId, payload, hostId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.Event.findById(eventId);
    if (!event) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Event not found");
    }
    // ✅ Only host who created event can update
    if (event.hostId.toString() !== hostId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You can only update your own events");
    }
    // Delete old image if new image is uploaded
    if (payload.image && event.image) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(event.image);
    }
    // Number/String conversion
    if (payload.minParticipants) {
        payload.minParticipants =
            typeof payload.minParticipants === "string"
                ? Number(payload.minParticipants)
                : payload.minParticipants;
    }
    if (payload.maxParticipants) {
        payload.maxParticipants =
            typeof payload.maxParticipants === "string"
                ? Number(payload.maxParticipants)
                : payload.maxParticipants;
    }
    if (payload.joiningFee) {
        payload.joiningFee =
            typeof payload.joiningFee === "string"
                ? Number(payload.joiningFee)
                : payload.joiningFee;
    }
    // Date conversion
    if (payload.date) {
        payload.date = new Date(payload.date);
    }
    // Update event with payload
    Object.assign(event, payload);
    yield event.save();
    return event;
});
exports.EventServices = {
    createEvent,
    getAllEventTypes,
    getMyEvents,
    getAllEvents,
    getSingleEvent,
    deleteEvent,
    deleteMyEvent,
    updateEvent,
    updateMyEvent
};
