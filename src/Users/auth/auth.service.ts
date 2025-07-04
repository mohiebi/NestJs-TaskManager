import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../create-user.dto';
import { User } from '../user.entity';
import { PasswordService } from '../password/password.service';
import { LoginDto } from '../user/login.dto';
import { LoginResponse } from '../user/login.response';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly passwordService: PasswordService,
    ) {}

    public async register(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userService.findOneByEmail(
            createUserDto.email,
        );
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        const user = await this.userService.createUser(createUserDto);
        //const token = this.generateToken(user);

        return user;
    }

    public async login(loginDto: LoginDto): Promise<LoginResponse> {
        const user = await this.userService.findOneByEmail(loginDto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const passwordValid = await this.passwordService.verifyPassword(
            loginDto.password,
            user?.password,
        );

        if (!passwordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const accessToken = await this.generateToken(user);

        return { accessToken };
    }

    private async generateToken(user: User): Promise<string> {
        const payload = { sub: user.id, name: user.name, roles: user.roles };
        return this.jwtService.sign(payload);
    }
}
