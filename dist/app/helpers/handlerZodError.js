"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const handleZodError = (err) => {
    const errorSources = [];
    if ((err === null || err === void 0 ? void 0 : err.issues) && Array.isArray(err.issues)) {
        err.issues.forEach((issue) => {
            errorSources.push({
                path: issue.path.join(".") || "unknown",
                message: issue.message,
            });
        });
    }
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources,
    };
};
exports.handleZodError = handleZodError;
