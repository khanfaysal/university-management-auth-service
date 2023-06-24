import { UserModel } from './../user/user.interface';
import httpStatus from 'http-status';
import apiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { ILoginUser, ILoginUserResponse } from './auth.interface';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  // creating instance of user login
  // const user = new User();
  // access to our instance method
  // const isUserExist = await user.isUserExist(id);

  const isUserExist = await User.isUserExist(id);

  if (!isUserExist) {
    throw new apiError(httpStatus.NOT_FOUND, 'User not found  ');
  }

  // match password
  // const isPasswordMatch = bcrypt.compare(password, isUserExist?.password);

  if (
    isUserExist.password &&
    !(await User.isPasswordMatch(password, isUserExist.password))
  ) {
    throw new apiError(httpStatus.UNAUTHORIZED, 'Password do not match');
  }

  // create jwt access token and refresh token
  const { id: userId, role, needsPasswordChange } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  console.log({ accessToken, refreshToken, needsPasswordChange });

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

export const AuthService = {
  loginUser,
};
