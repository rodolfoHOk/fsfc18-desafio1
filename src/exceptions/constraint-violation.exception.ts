import { PartnerApiException } from './partner-api.exception';

export class ConstraintViolationException extends PartnerApiException {
  constructor(message: string) {
    super(message);
  }
}
