"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preventLoggedInUser = void 0;
const AppError_1 = __importDefault(require("../errorHandler/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const preventLoggedInUser = (req, res, next) => {
    var _a, _b;
    const accessToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) ||
        ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
    if (accessToken) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are already logged in. Use change password instead.");
    }
    next();
};
exports.preventLoggedInUser = preventLoggedInUser;
