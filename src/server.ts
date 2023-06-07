import mongoose from 'mongoose'
import config from '../config'
import app from './app'
import { logger, errorLogger } from './share/logger';
import { Server } from 'http';

process.on('uncaughtException', error=>{
  errorLogger.error(error)
  process.exit(1)
})

let server: Server;

async function bootstrap() {

  try {
    await mongoose.connect(config.database_url as string)
    logger.info(`Database connected Successfully`)

    server = app.listen(config.port, () => {
      logger.info(`Application listening on port ${config.port}`)
    })
  } catch (error) {
    errorLogger.error('Failed to connect database', error)
  }
  process.on('unhandledRejection', error => {
    console.log('unhandledRejection is detected, we are colsing our server')
    if(server) {
      server.close((error) => {
        errorLogger.error(error)
        process.exit(1)
      })
    } else {

      process.exit(1);
    }
  })
}
bootstrap();

process.on('SIGTERM', ()=> {
  logger.info('SIGTERM is received');
  if(server) {
    server.close()
  }
})
