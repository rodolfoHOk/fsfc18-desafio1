import { PartnerApiException } from './partner-api.exception';

export class ReservationException extends PartnerApiException {
  constructor(message: string) {
    super(message);
  }
}
