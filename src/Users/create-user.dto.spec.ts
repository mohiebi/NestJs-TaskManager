import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
    let dto = new CreateUserDto();

    beforeEach(() => {
        dto = new CreateUserDto();
        dto.name = 'John Doe';
        dto.email = 'john.doe@example.com';
        dto.password = 'Password#123';
    });

    it('should be valid with correct data', async () => {
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should be invalid with incorrect email', async () => {
        dto.email = 'invalid-email';
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('email');
    });

    it('should be invalid with short password', async () => {
        dto.password = 'short';
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });

    const testPassword = async (password: string, message: string) => {
        dto.password = password;
        const errors = await validate(dto);

        const passwordError = errors.find((err) => err.property === 'password');
        expect(passwordError).not.toBeUndefined();
        const messages = Object.values(passwordError?.constraints ?? {});
        expect(messages).toContain(message);
    };

    // 1) at least 1 uppercase letter
    // 2) at least 1 lowercase letter
    // 3) at least 1 number
    // 4) at least 1 special character
    it('should return specific validation messages for weak password', async () => {
        await testPassword('weak', 'password must contain at least one uppercase letter');
        await testPassword('WEAK', 'password must contain at least one lowercase letter');
        await testPassword('Password', 'password must contain at least one number');
        await testPassword('Password1', 'password must contain at least one special character');
    });
});
