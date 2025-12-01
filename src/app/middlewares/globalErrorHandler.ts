 
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { handleDuplicateError } from "../helpers/handlerDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handlerZodError";
import { handleValidationError } from '../helpers/handlerValidationError'; 
import { TErrorSources } from "../interface/errorType";
import AppError from "../errorHandler/AppError";



// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrorHandler = async (error: any, req: Request, res: Response, next: NextFunction) => {

    let errorSources: TErrorSources[] = []
    let statusCode = 500
    let message = `Something Went Wrong!!`

    if (envVars.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(error);
    }

    // duplicate error 
    if (error.code === 11000) {
        const simplifiedError = handleDuplicateError(error)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }
    // Object ID error / Cast Error
    else if (error.name === 'CastError') {
        const simplifiedError = handleCastError(error)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }
    // Zod error 
    else if (error.name === 'ZodError') {
        const simplifiedError = handleZodError(error)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    //Mongoose Validation Error
    else if (error.name === 'ValidationError') {
        const simplifiedError = handleValidationError(error)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    else if (error instanceof AppError) {
        statusCode = error.statusCode
        message = error.message
    }
    else if (error instanceof Error) {
        statusCode = 500
        message = error.message
    }
    // send response 
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        error: envVars.NODE_ENV === "development" ? error : null,
        stack: envVars.NODE_ENV === "development" ? error.stack : null
    })
}