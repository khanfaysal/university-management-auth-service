import { NextFunction, Request, Response, } from 'express'
import { UserService } from './user.service'
import catchAsync from '../../../share/catchAsync'
import sendResponse from '../../../share/sendResponse'
import httpStatus from 'http-status'
import { IUser } from './user.interface'



const createUser = catchAsync(async (req: Request, res: Response, next:NextFunction )=> {

  const { user } = req.body;
  const result = await UserService.createUser(user);
  
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK, success: true, message: 'User created successfully', data: result,
    meta: {
      page: 0,
      limit: 0,
      total: 0
    }
  })
  next();
})

export const UserController = {
  createUser
}

