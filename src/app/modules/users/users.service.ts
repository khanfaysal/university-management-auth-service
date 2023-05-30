import config from '../../../../config/index'
import { IUser } from './users.interface'
import { User } from './users.model'
import { generateUserId } from './users.utils'

const createUser = async (user: IUser): Promise<IUser | null> => {
  /* need: 1. Auto generated incremental id
           2. default password
  */

  //     Auto generated incremental id

  const id = await generateUserId()
  user.id = id
  // default password
  if (!user.password) {
    user.password = config.default_user_pass as string
  }
  const createdUser = await User.create(user)
  if (!createdUser) {
    throw new Error('Failed to create user 😞')
  }
  return createdUser
}

export default {
  createUser,
}
