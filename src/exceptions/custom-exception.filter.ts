import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from './validation.exception';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = exception.getStatus();
    let message = exception.getResponse();
    let error;
    if (exception instanceof ValidationException) {
      status = 422;
      error = 'Unprocessable Entity';
      message = exception.validationErrors.flatMap((validationError) =>
        Object.values(validationError.constraints),
      );
    }

    return response.status(status).json({
      message,
      error,
      statusCode: status,
    });
  }
}
