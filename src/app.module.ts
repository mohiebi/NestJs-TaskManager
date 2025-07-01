import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfigSchema, ConfigType } from './config/config.types';
import { typeOrmConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeConfigService } from './config/type-config.service';
import { Task } from './tasks/task.entity';
import { User } from './Users/user.entity';
import { TaskLabel } from './tasks/task-label.entity';
import { authConfig } from './config/auth.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: TypeConfigService) => ({
        ...ConfigService.get('database'),
        entities: [Task, User, TaskLabel],
      }),
    }),
    ConfigModule.forRoot({
      load: [typeOrmConfig, authConfig],
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
