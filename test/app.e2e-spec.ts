import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { AppModule } from './../src/app.module';
import { userAdmin, userCustomer, userLogin } from './utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let adminJwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();

    const connection = app.get(Connection);
    await connection.synchronize(true);

    await connection
      .createQueryBuilder()
      .insert()
      .into('users')
      .values([userAdmin])
      .execute();
  });

  afterAll(() => {
    app.close();
  });

  describe('Authentication', () => {
    //some tests are of  => https://gist.github.com/mjclemente/e13995c29376f0924eb2eacf98eaa5a6

    it('authenticates user with valid credentials and provides a jwt token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: userLogin.email, password: userLogin.password })
        .expect(200);

      adminJwtToken = response.body.accessToken;
      expect(adminJwtToken).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );
    });

    it('fails to authenticate user with an incorrect password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: userLogin.email, password: 'wrong' })
        .expect(401);

      expect(response.body.accessToken).not.toBeDefined();
    });

    it('fails to authenticate user that does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: 'nobody@example.com', password: 'test' })
        .expect(401);

      expect(response.body.accessToken).not.toBeDefined();
    });
  });

  describe('Users', () => {
    it('should create a user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: userCustomer.email,
          password: userCustomer.password,
          name: userCustomer.name,
          lastname: userCustomer.lastname,
        })
        .expect(201);

      expect(response.body.email).toBe(userCustomer.email);
      expect(response.body.name).toBe(userCustomer.name);
      expect(response.body.lastname).toBe(userCustomer.lastname);
    });

    it('should not create a customer user with an invalid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'invalid',
          password: userCustomer.password,
          name: userCustomer.name,
          lastname: userCustomer.lastname,
        })
        .expect(400);
    });
  });
});
