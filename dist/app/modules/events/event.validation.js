"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventZodSchema = exports.createEventZodSchema = void 0;
const zod_1 = require("zod");
const event_interface_1 = require("./event.interface");
exports.createEventZodSchema = zod_1.z.object({
    eventName: zod_1.z
        .string({ error: "Event name is required" })
        .min(5, { message: "Event name must be at least 5 characters long." })
        .max(50, { message: "Event name cannot exceed 50 characters." }),
    eventType: zod_1.z
        .string({ error: "Event type is required" }),
    // hostId: z
    //   .string({ error: "HostId is required" }), 
    date: zod_1.z
        .string({ error: "Date is required" })
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    startTime: zod_1.z
        .string({ error: "Start time is required" }),
    endTime: zod_1.z
        .string({ error: "End time is required" }),
    minParticipants: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({ error: "Minimum participants is required" })),
    maxParticipants: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({ error: "Maximum participants is required" })),
    description: zod_1.z
        .string().optional(),
    image: zod_1.z
        .string().optional(),
    joiningFee: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({ error: "Joining fee is required" }).min(0, {
        message: "Joining fee cannot be negative",
    })),
    status: zod_1.z
        .enum(Object.values(event_interface_1.EventStatus))
        .default(event_interface_1.EventStatus.OPEN),
});
exports.updateEventZodSchema = zod_1.z.object({
    eventName: zod_1.z
        .string()
        .min(5, { message: "Event name must be at least 5 characters long." })
        .max(50, { message: "Event name cannot exceed 50 characters." })
        .optional(),
    eventType: zod_1.z.string().optional(),
    hostId: zod_1.z.string().optional(),
    date: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    })
        .optional(),
    startTime: zod_1.z.string().optional(),
    endTime: zod_1.z.string().optional(),
    minParticipants: zod_1.z
        .preprocess((val) => Number(val), zod_1.z.number().min(1, { message: "Minimum participants must be at least 1" }))
        .optional(),
    maxParticipants: zod_1.z
        .preprocess((val) => Number(val), zod_1.z.number().min(1, { message: "Maximum participants must be at least 1" }))
        .optional(),
    description: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
    joiningFee: zod_1.z
        .preprocess((val) => Number(val), zod_1.z.number().min(0, { message: "Joining fee cannot be negative" }))
        .optional(),
    status: zod_1.z.enum(Object.values(event_interface_1.EventStatus)).optional(),
});
