import { PartnerApiException } from './partner-api.exception';

export class SpotsAlreadyReservedException extends PartnerApiException {
  constructor(message: string) {
    super(message);
  }
}
