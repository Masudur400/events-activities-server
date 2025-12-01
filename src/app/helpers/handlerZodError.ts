/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from './../interface/errorType';  

export const handleZodError = (err:any):TGenericErrorResponse=>{
    const errorSources : TErrorSources[] =[] 
    err.issues.foreEach((issue:any)=>{
        errorSources.push({
            path:issue.paht[issue.path.length-1],
            message:issue.message
        })
    }) 
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources 
    } 
}