import httpStatus from 'http-status';
import apiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { ILoginUser } from './auth.interface';
import bcrypt from 'bcrypt';

const loginUser = async (payload: ILoginUser) => {
  const { id, password } = payload;

  // check user exist

  const isUserExist = await User.findOne(
    { id },
    { id: 1, password: 1, needsPasswordChange: 1 }
  ).lean();
  if (!isUserExist) {
    throw new apiError(httpStatus.NOT_FOUND, 'User not found  ');
  }

  // match password
  const isPasswordMatch = bcrypt.compare(password, isUserExist?.password);

  if (!isPasswordMatch) {
    throw new apiError(httpStatus.UNAUTHORIZED, 'Password do not match');
  }

  // create jwt access token
  return {};
};

export const AuthService = {
  loginUser,
};
