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
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const setTokens_1 = require("../../utils/setTokens");
const user_constents_1 = require("./user.constents");
const queryBuilder_1 = require("../../utils/queryBuilder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exist !");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = {
        provider: "credentials",
        providerId: email
    };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, auths: [authProvider] }, rest));
    const tokens = (0, setTokens_1.setTokens)({
        id: user._id.toString(),
        role: user.role
    });
    return { user, tokens };
});
const createHost = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    if (!email) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Email is required!");
    }
    if (!password) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password is required!");
    }
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exists!");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    // provider must be literal type "credentials"
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, auths: [authProvider], role: user_interface_1.Role.HOST }, rest));
    return user;
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(user_model_1.User.find().select('-password'), query)
        .filter()
        .search(user_constents_1.userSearchableFields)
        .sort()
        .fields()
        .pagination();
    const [data, meta] = yield Promise.all([
        queryBuilder.build(),
        queryBuilder.getMeta()
    ]);
    return { data, meta };
});
const getAllHosts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = query.searchTerm || "";
    // 🔍 search condition (name OR email)
    const searchCondition = searchTerm
        ? {
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { email: { $regex: searchTerm, $options: "i" } },
            ],
        }
        : {};
    const filterCondition = Object.assign({ role: user_interface_1.Role.HOST }, searchCondition);
    const data = yield user_model_1.User.find(filterCondition)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    const total = yield user_model_1.User.countDocuments(filterCondition);
    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select('-password');
    return {
        user
    };
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return {
        data: user
    };
});
const updateMyProfile = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    const allowedFields = ["name", "phone", "address", "picture", "bio"];
    // যদি নতুন ছবি আসে এবং আগের picture থাকে
    if (payload.picture && user.picture) {
        // আগের ছবি delete
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(user.picture);
    }
    // update allowed fields
    for (const field of allowedFields) {
        if (payload[field] !== undefined) {
            user.set(field, payload[field]);
        }
    }
    yield user.save();
    return user;
});
const updateUserByAdmin = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    const allowedFields = ["isDeleted", "isActive", "isVerified"];
    allowedFields.forEach((field) => {
        if (payload[field] !== undefined) {
            user.set(field, payload[field]);
        }
    });
    yield user.save();
    return user;
});
const deleteHost = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Host not found");
    }
    // Optional: Ensure we are only deleting users with the HOST role
    if (user.role !== user_interface_1.Role.HOST) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This user is not a host");
    }
    // 1. Delete image from Cloudinary if it exists
    if (user.picture) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(user.picture);
    }
    // 2. Delete the user record from DB
    yield user_model_1.User.findByIdAndDelete(userId);
    return null;
});
exports.UserServices = {
    createUser,
    createHost,
    getAllUsers,
    getAllHosts,
    getSingleUser,
    getMe,
    updateMyProfile,
    updateUserByAdmin,
    deleteHost
};
