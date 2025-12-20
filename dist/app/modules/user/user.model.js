"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
});
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String, required: false, default: null },
    password: { type: String },
    role: { type: String, enum: Object.values(user_interface_1.Role), default: user_interface_1.Role.USER },
    phone: { type: String, default: null },
    picture: { type: String, default: null },
    address: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: String, enum: Object.values(user_interface_1.IsActive), default: user_interface_1.IsActive.ACTIVE },
    isVerified: { type: Boolean, default: true },
    auths: [authProviderSchema],
    // bookings: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "bookings",
    //     }
    // ],
    // payments: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "payments",
    //     }
    // ],
}, {
    timestamps: true,
    versionKey: false
});
// bookings field removed for all role with out USER role 
// export interface IUserDocument extends IUser, Document { }
// userSchema.pre("save", async function (this: IUserDocument) {
//     if (this.role !== Role.USER) {
//         this.bookings = undefined; // remove for non-users
//     }
// });
exports.User = (0, mongoose_1.model)('User', userSchema);
