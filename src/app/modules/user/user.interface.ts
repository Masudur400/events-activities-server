import { Types } from "mongoose";



export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    HOST = "HOST", 
}

export interface IAuthProvider {
    provider: "google" | "credentials"
    providerId: string;
}

export interface IUser {
    _id?: Types.ObjectId
    bio?: string
    name: string
    email: string
    password?: string
    phone?: string
    picture?: string
    address?: string
    isDeleted?: string
    isActive?: IsActive
    isVerified?: boolean
    role: Role
    auths: IAuthProvider[]
    // bookings?: Types.ObjectId[] 
    // payments?: Types.ObjectId[] 
    createAt?: Date
    updatedAt?:Date 
}