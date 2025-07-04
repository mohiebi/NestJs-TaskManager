import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Post,
    SerializeOptions,
    UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../create-user.dto';
import { User } from '../user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from '../user/login.dto';
import { LoginResponse } from '../user/login.response';
import { serialize } from 'v8';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.authService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
        const accessToken = await this.authService.login(loginDto);
        return new LoginResponse(accessToken);
    }
}
