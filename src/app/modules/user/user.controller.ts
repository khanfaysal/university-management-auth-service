import { RequestHandler, } from 'express'
import { UserService } from './user.service'


const createUser: RequestHandler = async (req, res, next)=> {
  try {
    const { user } = req.body
    const result = await UserService.createUser(user)
    res.status(200).json({
      success: true,
      message: 'Successfully user create',  
      data: result,
    })
  } catch (err) {
    next(err)
  }
}

export const UserController = {
  createUser
}

