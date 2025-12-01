import { TGenericErrorResponse } from "../interface/errorType";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicateError = (err:any):TGenericErrorResponse =>{
const matchedArray = err.message.match(/"([^"]*)"/)
return {
        statusCode: 400,
        message: `${matchedArray[1]} already exists!!`
    }
}