import { NextFunction, Request, Response } from 'express'
import { AcademicSemesterService } from './academicSemester.service'
import catchAsync from '../../../share/catchAsync'
import sendResponse from '../../../share/sendResponse'
import httpStatus from 'http-status'
import { IAcademicSemester } from './academicSemester.interface'
import pick from '../../../share/pick'
import { paginationFields } from '../../../constant/pagination'


const createSemester= catchAsync(async (req: Request, res: Response, next: NextFunction)=> {
 
  const { ...academicSemesterData } = req.body
  const result = await AcademicSemesterService.createSemester(academicSemesterData)
  

  sendResponse<IAcademicSemester>(res, {statusCode: httpStatus.OK, success: true, message: 'Academic Semester created successfully', data: result})
  next();

})

const getAllSemesters = catchAsync( 
  async(req: Request, res: Response, next: NextFunction) => {
    
    const filters = pick(req.query, ['searchTerm']);

    const paginationOptions = pick(req.query, paginationFields)
    console.log(paginationOptions)
    const result = await AcademicSemesterService.getAllSemesters(filters, paginationOptions);

    sendResponse<IAcademicSemester[]>(res, {statusCode: httpStatus.OK, success: true, message: 'Semester retrieved successfully', meta: result.meta, data: result.data})
  next();
  })

export const AcademicSemesterController = {
    createSemester,
    getAllSemesters
}

