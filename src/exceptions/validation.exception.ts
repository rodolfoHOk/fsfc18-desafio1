import { ValidationError } from 'class-validator';
import { PartnerApiException } from './partner-api.exception';

export class ValidationException extends PartnerApiException {
  validationErrors: ValidationError[];

  constructor(validationErrors: ValidationError[]) {
    super('Unprocessable Entity');
    this.validationErrors = validationErrors;
  }
}
