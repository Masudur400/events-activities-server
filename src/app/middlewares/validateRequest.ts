/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";

export const validateRequest = (zodSchema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = req.body;

      // যদি client "data" field হিসেবে পাঠায়
      if (req.body.data) {
        try {
          payload = JSON.parse(req.body.data);
        } catch (err) {
          // JSON parse error
          return res.status(400).json({
            success: false,
            message: "Invalid JSON in 'data'. Make sure all property names are double-quoted.",
            errorSources: [
              {
                path: "data",
                message: (err as Error).message,
              },
            ],
          });
        }
      }

      // Multer থেকে file থাকলে path যোগ করা
      if (req.file?.path) {
        payload.picture = req.file.path;
      }

      // Zod validation
      req.body = await zodSchema.parseAsync(payload);

      next();
    } catch (err: any) {
      // যদি ZodError হয়
      if (err.name === "ZodError") {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errorSources: err.issues.map((issue: any) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      next(err);
    }
  };
