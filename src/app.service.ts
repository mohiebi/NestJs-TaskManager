import { Injectable } from '@nestjs/common';
import { TypeConfigService } from './config/type-config.service';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: TypeConfigService
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
