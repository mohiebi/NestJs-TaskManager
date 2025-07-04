import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';

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

    const TestUser = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'test-password',
    };

    it('testing registration (POST)', () => {
        return request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(TestUser)
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('id');
                expect(res.body.email).toBe(TestUser.email);
                expect(res.body.name).toBe(TestUser.name);
                expect(res.body.password).toBeUndefined();
            });
    });

    it('testing registering with duplicated email (POST)', async () => {
        await request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(TestUser);

        return request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(TestUser)
            .expect(409);
    });

    it('testing login (POST)', async () => {
        await request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(TestUser);

        const response = await request(testSetup.app.getHttpServer())
            .post('/auth/login')
            .send({
                email: TestUser.email,
                password: TestUser.password,
            });

        expect(response.status).toBe(201);
        expect(response.body.accessToken).toBeDefined();
    });
});
