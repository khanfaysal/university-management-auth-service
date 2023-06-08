import { ZodError, ZodIssue } from "zod";
import { IGenericErrorMessage } from "../interfaces/error";

const handleZodError = (error: ZodError) : IGenericErrorMessage=> {
    const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
        return {
            path: issue?.path[issue.path.length -1],
            message: issue?.message
        }
    })
    // console.log(error.issues.map((issue) => issue.path), 'Zod error')
    const statusCode = 400;
    return {
        statusCode,
        message: 'validation Error',
        errorMessages: errors
    }
}
export default handleZodError;