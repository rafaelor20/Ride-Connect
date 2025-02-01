import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { Vehicle } from '@faker-js/faker/vehicle';
import { Client } from '@googlemaps/google-maps-services-js';
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

// Mock the Client methods
jest.mock('@googlemaps/google-maps-services-js', () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        geocode: jest.fn(),
        distancematrix: jest.fn(),
      };
    }),
  };
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

    // Mock the external service responses
    const mockOriginGeo = {
      data: {
        results: [
          {
            geometry: { location: { lat: 37.7749, lng: -122.4194 } },
          },
        ],
      },
    };
    const mockDestinationGeo = {
      data: {
        results: [
          {
            geometry: { location: { lat: 34.0522, lng: -118.2437 } },
          },
        ],
      },
    };
    const mockDistanceMatrix = {
      data: {
        rows: [
          {
            elements: [
              {
                distance: { text: '558 km', value: 558000 },
                duration: { text: '6 hours 0 mins', value: 21600 },
              },
            ],
          },
        ],
      },
    };

    // Mock the behavior of external APIs
    //(Client.geocode as jest.Mock).mockResolvedValueOnce(mockOriginGeo).mockResolvedValueOnce(mockDestinationGeo);
    //(client.distancematrix as jest.Mock).mockResolvedValue(mockDistanceMatrix);

    Client.prototype.geocode = jest.fn().mockResolvedValueOnce(mockOriginGeo);
    Client.prototype.distancematrix = jest.fn().mockResolvedValue(mockDistanceMatrix);

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

describe('PATCH /ride/confirm', () => {
  it('should respond with status 401 when token is not provided', async () => {
    const response = await server.patch('/ride/confirm').send({
      origin: faker.address.streetName(),
      destination: faker.address.streetName(),
      distance: faker.datatype.number(),
      duration: faker.random.words(),
      driver: {
        id: faker.datatype.number(),
        name: faker.name.findName(),
      },
      value: faker.datatype.number(),
    });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 400 when origin is not provided', async () => {
    const customer = await createCustomer();
    const token = await generateValidToken(customer);
    const driver = await createDriver();
    const response = await server
      .patch('/ride/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({
        destination: faker.address.streetName(),
        distance: faker.datatype.number(),
        duration: faker.random.words(),
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: faker.datatype.number(),
      });

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when destination is not provided', async () => {
    const customer = await createCustomer();
    const token = await generateValidToken(customer);
    const driver = await createDriver();
    const response = await server
      .patch('/ride/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({
        origin: faker.address.streetName(),
        distance: faker.datatype.number(),
        duration: faker.random.words(),
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: faker.datatype.number(),
      });

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when origin is equal to destination', async () => {
    const customer = await createCustomer();
    const token = await generateValidToken(customer);
    const driver = await createDriver();
    const response = await server
      .patch('/ride/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({
        origin: faker.address.streetName(),
        destination: origin,
        distance: faker.datatype.number(),
        duration: faker.random.words(),
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: faker.datatype.number(),
      });

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when distance is not provided', async () => {
    const customer = await createCustomer();
    const token = await generateValidToken(customer);
    const driver = await createDriver();
    const response = await server
      .patch('/ride/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({
        origin: faker.address.streetName(),
        destination: faker.address.streetName(),
        duration: faker.random.words(),
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: faker.datatype.number(),
      });

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when duration is not provided', async () => {
    const customer = await createCustomer();
    const token = await generateValidToken(customer);
    const driver = await createDriver();
    const response = await server
      .patch('/ride/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({
        origin: faker.address.streetName(),
        destination: faker.address.streetName(),
        distance: faker.datatype.number(),
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: faker.datatype.number(),
      });

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when driver is not provided', async () => {
    const customer = await createCustomer();
    const token = await generateValidToken(customer);
    const driver = await createDriver();
    const response = await server.patch('/ride/confirm').set('Authorization', `Bearer ${token}`).send({
      origin: faker.address.streetName(),
      destination: faker.address.streetName(),
      distance: faker.datatype.number(),
      duration: faker.random.words(),
      value: faker.datatype.number(),
    });

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when value is not provided', async () => {
    const customer = await createCustomer();
    const token = await generateValidToken(customer);
    const driver = await createDriver();
    const response = await server
      .patch('/ride/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({
        origin: faker.address.streetName(),
        destination: faker.address.streetName(),
        distance: faker.datatype.number(),
        duration: faker.random.words(),
        driver: {
          id: driver.id,
          name: driver.name,
        },
      });

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 200 when all parameters are provided', async () => {
    const customer = await createCustomer();
    const token = await generateValidToken(customer);
    const driver = await createDriver();
    const response = await server
      .patch('/ride/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({
        origin: 'Universidade Federal de Sergipe',
        destination: 'Universidade Tiradentes',
        distance: faker.datatype.number(),
        duration: faker.random.words(),
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: faker.datatype.number(),
      });

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
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
        driver: expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
        value: expect.any(Number),
      }),
    );
  });
});
