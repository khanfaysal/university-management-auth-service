import httpStatus from "http-status";
import apiError from "../../../errors/ApiError";
import { academicSemesterTitleCodeMapper } from "./academicSemester.constant";
import { IAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createSemester = async (payload: IAcademicSemester): Promise<IAcademicSemester>=> {
    if(academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
        throw new apiError(httpStatus.BAD_REQUEST, 'invalid semester code')
    }
    const result = await AcademicSemester.create(payload);
    return result;
}
export const AcademicSemesterService = {
    createSemester
}