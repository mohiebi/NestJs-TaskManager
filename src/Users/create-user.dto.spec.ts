import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
    let dto = new CreateUserDto();

    beforeEach(() => {
        dto = new CreateUserDto();
        dto.name = 'John Doe';
        dto.email = 'john.doe@example.com';
        dto.password = 'password123';
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
        expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should be invalid with short password', async () => {
        dto.password = 'short';
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });
});
