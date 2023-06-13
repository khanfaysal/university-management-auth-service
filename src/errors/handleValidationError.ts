import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/error';
import mongoose from 'mongoose';

const handleValidationError = (
  error: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = Object.values(error.errors).map(
    (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: el?.path,
        message: el?.message,
      };
    }
  );
  const statusCode = 400;
  return {
    statusCode,
    message: 'validation  Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
