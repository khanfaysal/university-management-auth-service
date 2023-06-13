import { NextFunction, Request, Response } from 'express'
import { AcademicSemesterService } from './academicSemester.service'
import catchAsync from '../../../share/catchAsync'
import sendResponse from '../../../share/sendResponse'
import httpStatus from 'http-status'
import { IAcademicSemester } from './academicSemester.interface'
import pick from '../../../share/pick'
import { paginationFields } from '../../../constant/pagination'
import { academicSemesterFilterableFields } from './academicSemester.constant'


const createSemester= catchAsync(async (req: Request, res: Response, next: NextFunction)=> {
 
  const { ...academicSemesterData } = req.body
  const result = await AcademicSemesterService.createSemester(academicSemesterData)
  

  sendResponse<IAcademicSemester>(res, {
    statusCode: httpStatus.OK, success: true, message: 'Academic Semester created successfully', data: result,
    meta: {
      page: 0,
      limit: 0,
      total: 0
    }
  })
  next();

})

const getAllSemesters = catchAsync( 
  async(req: Request, res: Response, next: NextFunction) => {

    const filters = pick(req.query, academicSemesterFilterableFields);

    const paginationOptions = pick(req.query, paginationFields)

    const result = await AcademicSemesterService.getAllSemesters(filters, paginationOptions);

    sendResponse<IAcademicSemester[]>(res, {statusCode: httpStatus.OK, success: true, message: 'Semester retrieved successfully', meta: result.meta, data: result.data})
  next();
  })

const getSingleSemester = catchAsync(
  async (req:Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await AcademicSemesterService.getSingleSemester(id);

    sendResponse<IAcademicSemester>(res, {statusCode: httpStatus.OK, success: true, message: 'Single semester retrieved successfully', data: result})
  next();
})

export const AcademicSemesterController = {
    createSemester,
    getAllSemesters,
    getSingleSemester
}

