import { Injectable } from '@nestjs/common';
import { PasswordService } from '../password/password.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly passwordService: PasswordService,
    ) {}

    public async findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }

    public async createUser(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await this.passwordService.hashPassword(createUserDto.password);
        return await this.userRepository.save({
            ...createUserDto,
            password: hashedPassword,
        });
    }

    public async findOne(id: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ id });
    }
