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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (zodSchema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let payload = req.body;
        // যদি client "data" field হিসেবে পাঠায়
        if (req.body.data) {
            try {
                payload = JSON.parse(req.body.data);
            }
            catch (err) {
                // JSON parse error
                return res.status(400).json({
                    success: false,
                    message: "Invalid JSON in 'data'. Make sure all property names are double-quoted.",
                    errorSources: [
                        {
                            path: "data",
                            message: err.message,
                        },
                    ],
                });
            }
        }
        // Multer থেকে file থাকলে path যোগ করা
        if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) {
            payload.picture = req.file.path;
        }
        // Zod validation
        req.body = yield zodSchema.parseAsync(payload);
        next();
    }
    catch (err) {
        // যদি ZodError হয়
        if (err.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errorSources: err.issues.map((issue) => ({
                    path: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }
        next(err);
    }
});
exports.validateRequest = validateRequest;
