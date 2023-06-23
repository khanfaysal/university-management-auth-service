import httpStatus from 'http-status';
import apiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { ILoginUser } from './auth.interface';

const loginUser = async (payload: ILoginUser) => {
  const { id, password } = payload;

  const user = new User();
  const isUserExist = await user.isUserExist(id);

  if (!isUserExist) {
    throw new apiError(httpStatus.NOT_FOUND, 'User not found  ');
  }

  // match password
  // const isPasswordMatch = bcrypt.compare(password, isUserExist?.password);

  if (
    isUserExist.password &&
    !user.isPasswordMatch(password, isUserExist?.password)
  ) {
    throw new apiError(httpStatus.UNAUTHORIZED, 'Password do not match');
  }

  // create jwt access token
  return {};
};

export const AuthService = {
  loginUser,
};
