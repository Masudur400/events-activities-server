/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from './../interface/errorType';

export const handleZodError = (err: any): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];

  if (err?.issues && Array.isArray(err.issues)) {
    err.issues.forEach((issue: any) => {
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
