import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { ConfigType } from './config/config.types';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService<ConfigType>
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
