import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import routes from './app/routes'
import httpStatus from 'http-status'
// import apiError from './errors/ApiError';

const app: Application = express()

app.use(cors());

// parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// application routes
app.use('/api/v1', routes);


// testing purpose route
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!')
})

// global error handler
app.use(globalErrorHandler)

// handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [{
      path: req.originalUrl,
      message: 'Not found'
    }]
  })
  next();
})

export default app;

