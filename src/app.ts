import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import { UserRoutes } from './app/modules/user/user.route'
// import apiError from './errors/ApiError';

const app: Application = express()

app.use(cors())
// parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// application routes
app.use('/api/v1/users', UserRoutes)

// custom throw error

// testing purpose route
app.get('/', (req: Request, res: Response, next: NextFunction) => {
    // console.log(x)
    // Promise.reject((new Error('Unhandled promise rejecttion')))
  res.send('Hello World!')
//   throw new apiError(400, 'error string ( throw apiError) property 😧')
  // next('global error string property 😧')
})

// global error handler
app.use(globalErrorHandler)

export default app;

