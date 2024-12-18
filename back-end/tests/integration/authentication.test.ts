import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createCustomer } from '../factories';
import { cleanDb } from '../helpers';
import app, { init, close } from '@/app';

beforeAll(async () => {
  await init();
  await cleanDb();
});

afterAll(async () => {
  await close();
});

const server = supertest(app);

describe('POST /auth/sign-in', () => {
  it('should respond with status 400 when body is not given', async () => {
    const response = await server.post('/auth/sign-in');

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post('/auth/sign-in').send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe('when body is valid', () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });

    it('should respond with status 401 if there is no customer for given email', async () => {
      const body = generateValidBody();

      const response = await server.post('/auth/sign-in').send(body);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is a customer for given email but password is not correct', async () => {
      const body = generateValidBody();
      await createCustomer(body);

      const response = await server.post('/auth/sign-in').send({
        ...body,
        password: faker.lorem.word(),
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when credentials are valid', () => {
      it('should respond with status 200 and customer data', async () => {
        const body = generateValidBody();
        const customer = await createCustomer(body);

        const response = await server.post('/auth/sign-in').send(body);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          token: expect.any(String),
          id: customer.id,
          name: customer.name,
          email: customer.email,
        });
      });
    });
  });
});
