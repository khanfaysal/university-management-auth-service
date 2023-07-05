import httpStatus from 'http-status';
import apiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  const isUserExist = await User.isUserExist(id);
  console.log(isUserExist);

  if (!isUserExist) {
    throw new apiError(httpStatus.NOT_FOUND, 'User not found  ');
  }

  // match password
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

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  // verify token
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new apiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }

  // checking deleted user refresh token
  const { userId } = verifiedToken;
  const isUserExist = await User.isUserExist(userId);
  if (!isUserExist) {
    throw new apiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    { id: isUserExist.id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;
  console.log({ user });

  //   // checking is user exists
  // const isUserExist = await User.isUserExist(user?.userId);

  // alternative way
  const isUserExist = await User.findOne({ id: user?.userId }).select(
    '+password'
  );
  console.log(isUserExist);

  if (!isUserExist) {
    throw new apiError(httpStatus.NOT_FOUND, 'User not found  ');
  }
  // checking old password
  if (
    isUserExist.password &&
    !(await User.isPasswordMatch(oldPassword, isUserExist.password))
  ) {
    throw new apiError(httpStatus.UNAUTHORIZED, 'Old password do not match');
  }

  // // hash password before saving
  // const newHashPassword = await bcrypt.hash(
  //   newPassword,
  //   Number(config.bcrypt_salt_rounds)
  // );

  // // update password

  // const query = { id: user?.userId };
  // const updateData = {
  //   password: newHashPassword,
  //   needsPasswordChange: false,
  //   passwordChangeAt: new Date(),
  // };
  // await User.findOneAndUpdate(query, updateData);

  // data update
  isUserExist.password = newPassword;
  isUserExist.needsPasswordChange = false;

  // updating using save
  isUserExist.save();
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
};
