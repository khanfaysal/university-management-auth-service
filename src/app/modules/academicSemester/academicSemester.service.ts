import httpStatus from 'http-status';
import apiError from '../../../errors/ApiError';
import { academicSemesterSearchableFields, academicSemesterTitleCodeMapper } from './academicSemester.constant';
import {
  IAcademicSemester,
  IAcademicSemesterFilter,
} from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { SortOrder } from 'mongoose';

const createSemester = async (
  payload: IAcademicSemester
): Promise<IAcademicSemester> => {
  if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
    throw new apiError(httpStatus.BAD_REQUEST, 'invalid semester code');
  }
  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllSemesters = async (
  filters: IAcademicSemesterFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAcademicSemester[]>> => {

  const { searchTerm, ...filtersData } = filters;
 
  
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: academicSemesterSearchableFields.map(field => ({
        [field]: { 
            $regex: searchTerm,
            $options: 'i',
        }
      })),
    });
  }


  if(Object.keys(filtersData).length) { 
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      }))
    })
  }

  const whereConditions = andConditions.length > 0 ? {$and: andConditions} : {}

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortCondtions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondtions[sortBy] = sortOrder;
  }
  const result = await AcademicSemester.find(whereConditions)
    .sort(sortCondtions)
    .skip(skip)
    .limit(limit);

  const total = await AcademicSemester.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
export const AcademicSemesterService = {
  createSemester,
  getAllSemesters,
};
