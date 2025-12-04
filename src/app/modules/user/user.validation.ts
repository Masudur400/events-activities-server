import { IsActive, Role } from "./user.interface";
import { z } from "zod";




export const createUserZodSchema = z.object({
    name: z
        .string({ error: "Name must be string" })
        .min(4, { message: "Name must be at least 4 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    // name: z.object({
    //     firstName: z.string({ error: "Name must be string" })
    //         .min(2, { message: "Name must be at least 2 characters long." })
    //         .max(50, { message: "Name cannot exceed 50 characters." }),
    //     lastName: z.object({
    //         nickName: z.string({ error: "Name must be string" })
    //             .min(2, { message: "Name must be at least 2 characters long." })
    //             .max(50, { message: "Name cannot exceed 50 characters." }),

    //         surName: z.string({ error: "Name must be string" })
    //             .min(2, { message: "Name must be at least 2 characters long." })
    //             .max(50, { message: "Name cannot exceed 50 characters." }),
    //     })
    // }),
    email: z
        .string({ error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    password: z
        .string({ error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." }),
        // .regex(/^(?=.*[A-Z])/, {
        //     message: "Password must contain at least 1 uppercase letter.",
        // })
        // .regex(/^(?=.*[!@#$%^&*])/, {
        //     message: "Password must contain at least 1 special character.",
        // })
        // .regex(/^(?=.*\d)/, {
        //     message: "Password must contain at least 1 number.",
        // }),
     
})



export const updateUserZodSchema = z.object({
    name: z
        .string({ error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),

    phone: z
        .string({ error: "Phone must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),

    bio: z
        .string({ error: "Bio must be string" })
        .min(10, { message: "Bio must be at least 10 characters long." })
        .max(100, { message: "Bio cannot exceed 200 characters." })
        .optional(),

    address: z
        .string({ error: "Address must be string" })
        .max(100, { message: "Address cannot exceed 200 characters." })
        .optional(),

    role: z
        .enum(Object.values(Role) as [string, ...string[]])
        .optional(),

    isActive: z
        .enum(Object.values(IsActive) as [string, ...string[]])
        .optional(),

    isDeleted: z
        .boolean({ error: "isDeleted must be true or false" })
        .optional(),

    isVerified: z
        .boolean({ error: "isVerified must be true or false" })
        .optional(),
});
