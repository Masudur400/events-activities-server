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
exports.userControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const setCookies_1 = require("../../utils/setCookies");
const AppError_1 = __importDefault(require("../../errorHandler/AppError"));
const user_interface_1 = require("./user.interface");
const createUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, tokens } = yield user_service_1.UserServices.createUser(req.body);
    (0, setCookies_1.setAuthCookie)(res, tokens);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "User Created Successfully",
        data: {
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        },
    });
}));
const createHost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { picture: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const result = yield user_service_1.UserServices.createHost(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "User Created Successfully",
        data: result,
    });
}));
const getAllUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield user_service_1.UserServices.getAllUsers(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    });
}));
const getAllHosts = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getAllHosts(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All hosts retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield user_service_1.UserServices.getSingleUser(id);
    if (!result.user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User Retrieved Successfully",
        data: result.user
    });
}));
const getMe = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield user_service_1.UserServices.getMe(decodedToken.id);
    if (!result.data) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Your profile Retrieved Successfully",
        data: result.data,
    });
}));
const updateMyProfile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId)
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized");
    // validated data from Zod
    const payload = Object.assign({}, req.body);
    // multer file
    if ((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) {
        payload.picture = req.file.path;
    }
    const updatedUser = yield user_service_1.UserServices.updateMyProfile(userId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Profile updated successfully",
        data: updatedUser,
    });
}));
const updateUserByAdmin = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const adminRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    if (adminRole !== user_interface_1.Role.SUPER_ADMIN) {
        res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: "Only SUPER_ADMIN can update user status",
        });
        return;
    }
    const userId = req.params.id; // admin update target user
    if (!userId) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "User ID is required",
        });
        return;
    }
    const payload = req.body; // Only isDeleted, isActive, isVerified 
    const updatedUser = yield user_service_1.UserServices.updateUserByAdmin(userId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User updated successfully",
        data: updatedUser,
    });
}));
const deleteHost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield user_service_1.UserServices.deleteHost(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Host deleted successfully",
        data: null,
    });
}));
exports.userControllers = {
    createUser,
    createHost,
    getAllUser,
    getAllHosts,
    getSingleUser,
    getMe,
    updateMyProfile,
    updateUserByAdmin,
    deleteHost
};
