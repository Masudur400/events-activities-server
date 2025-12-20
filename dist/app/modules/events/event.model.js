"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = require("mongoose");
const event_interface_1 = require("./event.interface");
const eventSchema = new mongoose_1.Schema({
    eventName: { type: String, required: true },
    eventType: { type: String, required: true },
    date: { type: Date, required: true },
    hostId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    minParticipants: { type: Number, required: true },
    maxParticipants: { type: Number, required: true },
    bookedParticipants: { type: Number, default: 0 },
    description: { type: String },
    image: { type: String },
    joiningFee: { type: Number, required: true, default: 0 },
    status: {
        type: String,
        enum: Object.values(event_interface_1.EventStatus),
        default: event_interface_1.EventStatus.OPEN
    },
    totalReviews: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Event = (0, mongoose_1.model)("Event", eventSchema);
