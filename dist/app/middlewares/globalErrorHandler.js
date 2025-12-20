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
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const handlerDuplicateError_1 = require("../helpers/handlerDuplicateError");
const handleCastError_1 = require("../helpers/handleCastError");
const handlerZodError_1 = require("../helpers/handlerZodError");
const handlerValidationError_1 = require("../helpers/handlerValidationError");
const AppError_1 = __importDefault(require("../errorHandler/AppError"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const globalErrorHandler = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let errorSources = [];
    let statusCode = 500;
    let message = `Something Went Wrong!!`;
    if (env_1.envVars.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(error);
    }
    // duplicate error 
    if (error.code === 11000) {
        const simplifiedError = (0, handlerDuplicateError_1.handleDuplicateError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Object ID error / Cast Error
    else if (error.name === 'CastError') {
        const simplifiedError = (0, handleCastError_1.handleCastError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Zod error 
    else if (error.name === 'ZodError') {
        const simplifiedError = (0, handlerZodError_1.handleZodError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    //Mongoose Validation Error
    else if (error.name === 'ValidationError') {
        const simplifiedError = (0, handlerValidationError_1.handleValidationError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (error instanceof AppError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else if (error instanceof Error) {
        statusCode = 500;
        message = error.message;
    }
    // send response 
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        error: env_1.envVars.NODE_ENV === "development" ? error : null,
        stack: env_1.envVars.NODE_ENV === "development" ? error.stack : null
    });
});
exports.globalErrorHandler = globalErrorHandler;
