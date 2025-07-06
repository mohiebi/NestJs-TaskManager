import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './../src/Users/user.entity';
import { Role } from './../src/Users/role.enum';
import { PasswordService } from './../src/Users/password/password.service';
import { JwtService } from '@nestjs/jwt';

describe('AppController (e2e)', () => {
    let testSetup: TestSetup;

    beforeEach(async () => {
        testSetup = await TestSetup.create(AppModule);
    });

    afterEach(async () => {
        await testSetup.cleanup();
    });

    afterAll(async () => {
        await testSetup.teardown();
    });

    const testUser = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'test-password',
    };

    it('should require authentication for protected routes', async () => {
        const response = await request(testSetup.app.getHttpServer())
            .get('/tasks')
            .expect(401);

        expect(response.body.message).toBe('Unauthorized');
    });

    it('should allow access to public routes', async () => {
        const userRepo = testSetup.app.get(getRepositoryToken(User));

        await userRepo.save({
            ...testUser,
            roles: [Role.ADMIN],
            password: await testSetup.app
                .get(PasswordService)
                .hashPassword(testUser.password),
        });

        const response = await request(testSetup.app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password });

        const decoded = testSetup.app
            .get(JwtService)
            .verify(response.body.accessToken);

        expect(decoded.roles).toBeDefined();
        expect(decoded.roles).toContain(Role.ADMIN);
    });

    it('testing registration (POST)', () => {
        return request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(testUser)
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('id');
                expect(res.body.email).toBe(testUser.email);
                expect(res.body.name).toBe(testUser.name);
                expect(res.body.password).toBeUndefined();
            });
    });

    it('testing registering with duplicated email (POST)', async () => {
        await request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(testUser);

        return request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(testUser)
            .expect(409);
    });

    it('testing login (POST)', async () => {
        await request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(testUser);

        const response = await request(testSetup.app.getHttpServer())
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        expect(response.status).toBe(201);
        expect(response.body.accessToken).toBeDefined();
    });

    it('testing Authorization and Token (Get)', async () => {
        await request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(testUser);

        const response = await request(testSetup.app.getHttpServer())
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        const token = response.body.accessToken;

        return await request(testSetup.app.getHttpServer())
            .get('/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(testUser.email);
                expect(res.body.name).toBe(testUser.name);
                expect(res.body.password).toBeUndefined();
            });
    });

    it('testing Authorization and Token with fake token(Get)', async () => {
        await request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(testUser);

        const response = await request(testSetup.app.getHttpServer())
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        const token = response.body.accessToken;

        return await request(testSetup.app.getHttpServer())
            .get('/auth/profile')
            .set('Authorization', `Bearer xxx`)
            .expect(401)
            .expect((res) => {
                expect(res.body.message).toBe('Unauthorized');
            });
    });

    it('/auth/admin (GET) - admin access', async () => {
        const userRepo = testSetup.app.get(getRepositoryToken(User));

        await userRepo.save({
            ...testUser,
            roles: [Role.ADMIN],
            password: await testSetup.app
                .get(PasswordService)
                .hashPassword(testUser.password),
        });

        const response = await request(testSetup.app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password });
        const token = response.body.accessToken;

        return request(testSetup.app.getHttpServer())
            .get('/auth/admin')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.message).toBe('This is an admin-only route');
            });
    });
});
