import httpStatus from 'http-status';
import apiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { ILoginUser, ILoginUserResponse } from './auth.interface';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import jwt from 'jsonwebtoken';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  // creating instance of user login
  // const user = new User();
  // access to our instance method
  // const isUserExist = await user.isUserExist(id);

  const isUserExist = await User.isUserExist(id);
  console.log(isUserExist);

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

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  // verify token
  let verifiedToken = null;
  try {
    verifiedToken = jwt.verify(token, config.jwt.refresh_secret);
    console.log('verifiedToken', verifiedToken);
  } catch (err) {
    throw new apiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }

  // checking deleted user refresh token
  const { userId, role } = verifiedToken;
  const isUserExist = await User.isUserExist(userId);
  if (!isUserExist) {
    throw new apiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  // generate new token
};

export const AuthService = {
  loginUser,
  refreshToken,
};
