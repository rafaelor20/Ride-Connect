
import httpStatus from 'http-status';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { cleanDb } from '../helpers';
import { createCustomer } from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST /auth/forgot-password', () => {
  it('should return 404 if user does not exist', async () => {
    const response = await server.post('/auth/forgot-password').send({
      email: faker.internet.email(),
    });

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should return 200 and send an email if user exists', async () => {
    const user = await createCustomer();

    const response = await server.post('/auth/forgot-password').send({
      email: user.email,
    });

    expect(response.status).toBe(httpStatus.OK);
  });
});

describe('POST /auth/reset-password', () => {
  it('should return 401 if token is invalid', async () => {
    const response = await server.post('/auth/reset-password').send({
      token: faker.lorem.word(),
      password: faker.internet.password(),
    });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should return 200 and reset the password if token is valid', async () => {
    const user = await createCustomer();

    const forgotPasswordResponse = await server.post('/auth/forgot-password').send({
      email: user.email,
    });

    const token = forgotPasswordResponse.body.token;

    const response = await server.post('/auth/reset-password').send({
      token,
      password: faker.internet.password(),
    });

    expect(response.status).toBe(httpStatus.OK);
  });
});
