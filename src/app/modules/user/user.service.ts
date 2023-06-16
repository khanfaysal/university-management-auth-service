import { IStudent } from './../student/student.interface';
import config from '../../../../config/index';
import apiError from '../../../errors/ApiError';
import { IUser } from './user.interface';
import { User } from './user.model';
import { generateFacultyId, generateStudentId } from './user.utils';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Student } from '../student/student.model';

const createStudent = async (
  student: IStudent,
  user: IUser
): Promise<IUser | null> => {
  // Auto generated incremental id

  // default password
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }

  // set role

  user.role = 'student';

  const academicsemester = await AcademicSemester.findById(
    student.academicSemester
  );

  // generate student id
  let newUserAllData = null;
  // session start and then transaction start into try block
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const id = await generateStudentId(academicsemester);
    user.id = id;
    student.id = id;

    const newStudent = await Student.create([student], { session });
    if (!newStudent.length) {
      throw new apiError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    // set student --> _id into user.student
    user.student = newStudent[0]._id;
    const newUser = await User.create([user], {});
    if (!newUser.length) {
      throw new apiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();

    if (newUserAllData) {
      newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
        path: 'student',
        populate: [
          {
            path: 'academicSemester',
          },
          {
            path: 'academicDepartment',
          },
          {
            path: 'academicFaculty',
          },
        ],
      });
    }
    return newUserAllData;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const UserService = {
  createStudent,
};
