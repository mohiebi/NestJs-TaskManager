import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { TypeConfigService } from 'src/config/type-config.service';
import { AuthConfig } from 'src/config/auth.config';
import { ConfigModule } from '@nestjs/config/dist/config.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: TypeConfigService) => ({
                secret: config.get<AuthConfig>('auth')?.jwt.secret,
                signOptions: {
                    expiresIn: config.get<AuthConfig>('auth')?.jwt.expiresIn,
                },
            }),
        }),
    ],
})
export class UsersModule {}
