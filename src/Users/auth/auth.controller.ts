import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    NotFoundException,
    Post,
    Request,
    SerializeOptions,
    UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../create-user.dto';
import { User } from '../user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from '../user/login.dto';
import { LoginResponse } from '../user/login.response';
import { AuthRequest } from '../user/auth.request';
import { UserService } from '../user/user.service';
import { Public } from '../decorators/public.decorator';
import { Role } from '../role.enum';
import { AdminResponse } from '../user/admin.response';
import { Roles } from '../decorators/roles.decorator';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Post('register')
    @Public()
    async register(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.authService.register(createUserDto);
    }

    @Post('login')
    @Public()
    async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
        const accessToken = await this.authService.login(loginDto);
        return new LoginResponse(accessToken);
    }

    @Get('profile')
    async profile(@Request() request: AuthRequest): Promise<User> {
        const user = await this.userService.findOne(request.user.sub);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    @Get('admin')
    @Roles(Role.ADMIN)
    async adminOnly(): Promise<AdminResponse> {
        return new AdminResponse({ message: 'This is an admin-only route' });
    }
}
