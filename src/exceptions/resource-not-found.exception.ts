import { PartnerApiException } from './partner-api.exception';

export class ResourceNotFoundException extends PartnerApiException {
  constructor(message: string) {
    super(message);
  }
}
