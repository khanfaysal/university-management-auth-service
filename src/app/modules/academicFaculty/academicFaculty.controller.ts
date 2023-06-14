import { Request, Response } from 'express';
import catchAsync from '../../../share/catchAsync';
import sendResponse from '../../../share/sendResponse';
import httpStatus from 'http-status';
import { IAcademicFaculty } from './academicFaculty.interface';
import { AcademicFacultyService } from './academicFaculty.service';

const createFaculty = catchAsync(async (req: Request, res: Response) => {
  const { ...academicFacultyData } = req.body;
  const result = await AcademicFacultyService.createFaculty(
    academicFacultyData
  );

  sendResponse<IAcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester created successfully',
    data: result,
  });
});

export const AcademicFacultyController = {
  createFaculty,
};
