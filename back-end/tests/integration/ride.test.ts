import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { Vehicle } from '@faker-js/faker/vehicle';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createCustomer,
  createSession,
  createDriver,
  createDestination,
  createOrigin,
  createReview,
  createRide,
} from '../factories';
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

describe('POST /ride/estimate', () => {
  it('should respond with status 401 when token is not provided', async () => {
    const response = await server.post('/ride/estimate').send({
      origin: faker.address.streetName(),
      destination: faker.address.streetName(),
    });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 400 when origin is not provided', async () => {
    const token = await generateValidToken();
    const response = await server.post('/ride/estimate').set('Authorization', `Bearer ${token}`).send({
      destination: faker.address.streetName(),
    });

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when destination is not provided', async () => {
    const token = await generateValidToken();
    const response = await server.post('/ride/estimate').set('Authorization', `Bearer ${token}`).send({
      origin: faker.address.streetName(),
    });

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 200 when all parameters are provided', async () => {
    const token = await generateValidToken();
    const response = await server.post('/ride/estimate').set('Authorization', `Bearer ${token}`).send({
      origin: faker.address.streetName(),
      destination: faker.address.streetName(),
    });

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        origin: expect.objectContaining({
          latitude: expect.any(Number),
          longitude: expect.any(Number),
        }),
        destination: expect.objectContaining({
          latitude: expect.any(Number),
          longitude: expect.any(Number),
        }),
        distance: expect.any(String),
        duration: expect.any(String),
        options: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            vehicle: expect.any(String),
            review: expect.objectContaining({
              rating: expect.any(Number),
              comment: expect.any(String),
            }),
            value: expect.any(Number),
          }),
        ]),
      }),
    );
  });
});
