import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { appConfigSchema, ConfigType } from './config/config.types';
import { typeOrmConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeConfigService } from './config/type-config.service';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: TypeConfigService) => ({
        ...ConfigService.get('database'),
        entities: [Task],
      }),
    }),
    ConfigModule.forRoot({
      load: [appConfig, typeOrmConfig],
      validationSchema: appConfigSchema,
      validationOptions:{
        // allowUnknown: true,
        abortEarly: true,
      }
    }),
    TasksModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: TypeConfigService,
      useExisting: ConfigService,
    },
  ],
})
export class AppModule {}
