import httpStatus from "http-status";
import apiError from "../../../errors/ApiError";
import { academicSemesterTitleCodeMapper } from "./academicSemester.constant";
import { IAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";



const createSemester = async (payload: IAcademicSemester): Promise<IAcademicSemester>=> {
    if(academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
        throw new apiError(httpStatus.BAD_REQUEST, 'invalid semester code')
    }
    const result = await AcademicSemester.create(payload);
    return result;
}



const getAllSemesters = async (paginationOptions: IPaginationOptions): Promise<IGenericResponse<IAcademicSemester[]>>=> {
    const {page = 1, limit = 10} = paginationOptions;
    const skip = (page - 1) * limit;
    const result = await AcademicSemester.find().sort().skip(skip).limit(limit)
    const total = await AcademicSemester.countDocuments()
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
}
export const AcademicSemesterService = {
    createSemester,
    getAllSemesters
}