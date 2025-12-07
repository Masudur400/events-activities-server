import { z } from "zod";
import { EventStatus } from "./event.interface";

export const createEventZodSchema = z.object({
  eventName: z
    .string({ error: "Event name is required" })
    .min(5, { message: "Event name must be at least 5 characters long." })
    .max(50, { message: "Event name cannot exceed 50 characters." }), 
  eventType: z
    .string({ error: "Event type is required" }), 
  // hostId: z
  //   .string({ error: "HostId is required" }), 
  date: z
    .string({ error: "Date is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }), 
  startTime: z
    .string({ error: "Start time is required" }), 
  endTime: z
    .string({ error: "End time is required" }), 
  minParticipants: z.preprocess(
    (val) => Number(val),
    z.number({ error: "Minimum participants is required" })
  ), 
  maxParticipants: z.preprocess(
    (val) => Number(val),
    z.number({ error: "Maximum participants is required" })
  ), 
  description: z
    .string().optional(), 
  image: z
    .string().optional(), 
  joiningFee: z.preprocess(
    (val) => Number(val),
    z.number({ error: "Joining fee is required" }).min(0, {
      message: "Joining fee cannot be negative",
    })
  ), 
  status: z
    .enum(Object.values(EventStatus) as [string, ...string[]])
    .default(EventStatus.OPEN),
});



export const updateEventZodSchema = z.object({
  eventName: z
    .string()
    .min(5, { message: "Event name must be at least 5 characters long." })
    .max(50, { message: "Event name cannot exceed 50 characters." })
    .optional(),

  eventType: z.string().optional(),

  hostId: z.string().optional(),

  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .optional(),

  startTime: z.string().optional(),

  endTime: z.string().optional(),

  minParticipants: z
    .preprocess((val) => Number(val), z.number().min(1, { message: "Minimum participants must be at least 1" }))
    .optional(),

  maxParticipants: z
    .preprocess((val) => Number(val), z.number().min(1, { message: "Maximum participants must be at least 1" }))
    .optional(),

  description: z.string().optional(),

  image: z.string().optional(),

  joiningFee: z
    .preprocess((val) => Number(val), z.number().min(0, { message: "Joining fee cannot be negative" }))
    .optional(),

  status: z.enum(Object.values(EventStatus) as [string, ...string[]]).optional(),
});
