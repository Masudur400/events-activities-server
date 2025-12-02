import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";




const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
})


const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    phone: { type: String, default: null },
    picture: { type: String, default: null },
    address: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: String, enum: Object.values(IsActive), default: IsActive.ACTIVE },
    isVerified: { type: Boolean, default: true },
    auths: [authProviderSchema],
    bookings: [
        {
            type: Schema.Types.ObjectId,
            ref: "bookings",
        }
    ],
 

}, {
    timestamps: true,
    versionKey: false
})


// bookings field removed for all role with out USER role 
export interface IUserDocument extends IUser, Document {} 
userSchema.pre("save", async function (this: IUserDocument) {
  if (this.role !== Role.USER) {
    this.bookings = undefined; // remove for non-users
  }
});

export const User = model<IUser>('User', userSchema)