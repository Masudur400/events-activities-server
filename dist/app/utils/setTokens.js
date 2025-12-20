"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const setTokens = (payload) => {
    const accessOptions = {
        expiresIn: env_1.envVars.ACCESS_EXPIRES,
    };
    const refreshOptions = {
        expiresIn: env_1.envVars.REFRESH_EXPIRES,
    };
    const accessToken = jsonwebtoken_1.default.sign(payload, env_1.envVars.ACCESS_SECRET, accessOptions);
    const refreshToken = jsonwebtoken_1.default.sign(payload, env_1.envVars.REFRESH_SECRET, refreshOptions);
    return {
        accessToken,
        refreshToken,
    };
};
exports.setTokens = setTokens;
