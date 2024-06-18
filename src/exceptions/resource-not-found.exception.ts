import { HttpException, HttpStatus } from '@nestjs/common';

export class ResourceNotFoundException extends HttpException {
  message: string;

  constructor(message: string) {
    super('Not Found', HttpStatus.NOT_FOUND);
    this.message = message;
  }
}
