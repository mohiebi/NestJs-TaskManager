import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    NotFoundException,
    Post,
    Request,
    SerializeOptions,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../create-user.dto';
import { User } from '../user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from '../user/login.dto';
import { LoginResponse } from '../user/login.response';
import { AuthRequest } from '../user/auth.request';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../user/auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.authService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
        const accessToken = await this.authService.login(loginDto);
        return new LoginResponse(accessToken);
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    async profile(@Request() request: AuthRequest): Promise<User> {
        const user = await this.userService.findOne(request.user.sub);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}
