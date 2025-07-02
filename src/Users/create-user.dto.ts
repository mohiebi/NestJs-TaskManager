import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @Matches(/[a-z]/, { message: 'password must contain at least one lowercase letter' })
    @Matches(/[A-Z]/, { message: 'password must contain at least one uppercase letter' })
    @Matches(/[0-9]/, { message: 'password must contain at least one number' })
    @Matches(/[^A-Za-z0-9]/, { message: 'password must contain at least one special character' })
    password: string;
}
