import { Module } from "@nestjs/common";
import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { TypeConfigService } from "src/config/type-config.service";
import { AuthConfig } from "src/config/auth.config";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: TypeConfigService) => ({
                secret: config.get<AuthConfig>('auth')?.jwt.secret,
                signOptions: {
                    expiresIn: config.get<AuthConfig>('auth')?.jwt.expiresIn
                },
            }),
        }),
    ]
})
export class UsersModule {}