jest.mock('@googlemaps/google-maps-services-js', () => ({
  Client: jest.fn(() => ({
    distancematrix: jest.fn(() => Promise.resolve({})),
  })),
}));

import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb } from '../helpers';
import { prisma } from '@/config';
import app, { init, close } from '@/app';

beforeAll(async () => {
  await init();
  await cleanDb();
});

afterAll(async () => {
  await close();
});

const server = supertest(app);

describe('POST /users', () => {
  it('should respond with status 422 when email is not valid', async () => {
    const body = {
      name: faker.name.findName(),
      email: faker.lorem.word(),
      password: faker.internet.password(6),
    };

    const response = await server.post('/users').send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 422 when password is not valid', async () => {
    const body = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.lorem.word(5),
    };

    const response = await server.post('/users').send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe('when body is valid', () => {
    const generateValidBody = () => ({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });

    it('should not register customer with duplicated email', async () => {
      const body = generateValidBody();
      await prisma.customer.create({ data: body });

      const response = await server.post('/users').send(body);

      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it('should not return customer password on body', async () => {
      const body = generateValidBody();

      const response = await server.post('/users').send(body);

      expect(response.body).not.toHaveProperty('password');
    });

    it('should save customer on db', async () => {
      const body = generateValidBody();

      const response = await server.post('/users').send(body);

      const customer = await prisma.customer.findUnique({
        where: { email: body.email },
      });
      expect(customer).toEqual(
        expect.objectContaining({
          name: body.name,
          id: response.body.id,
          email: body.email,
        }),
      );
    });
  });
});
