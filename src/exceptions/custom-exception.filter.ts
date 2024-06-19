import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from './validation.exception';
import { ResourceNotFoundException } from './resource-not-found.exception';
import { SpotsAlreadyReservedException } from './spots-already-reserved.exception';
import { ReservationException } from './reservation.exception';
import { PartnerApiException } from './partner-api.exception';
import { ConstraintViolationException } from './constraint-violation.exception';

@Catch(PartnerApiException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: PartnerApiException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = exception.getStatus();
    let message = exception.getResponse();

    if (exception instanceof ValidationException) {
      status = 422;
      message = exception.validationErrors.flatMap((validationError) =>
        Object.values(validationError.constraints),
      );
    } else if (exception instanceof ResourceNotFoundException) {
      status = 404;
      message = exception.message;
    } else if (exception instanceof SpotsAlreadyReservedException) {
      status = 400;
      message = exception.message;
    } else if (exception instanceof ReservationException) {
      status = 400;
      message = exception.message;
    } else if (exception instanceof ConstraintViolationException) {
      status = 400;
      message = exception.message;
    } else if (exception instanceof PartnerApiException) {
      status = 500;
      message = exception.message;
    }

    return response.status(status).json({
      message,
    });
  }
}
