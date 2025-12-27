import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import { createCustomer, createDriver } from '../factories';
import app, { init, close } from '@/app';

// eslint-disable-next-line no-var
var geocodeMock: jest.Mock;
// eslint-disable-next-line no-var
var distanceMatrixMock: jest.Mock;

jest.mock('@googlemaps/google-maps-services-js', () => {
  geocodeMock = jest.fn();
  distanceMatrixMock = jest.fn();

  return {
    __esModule: true,
    Client: jest.fn().mockImplementation(() => ({
      geocode: geocodeMock,
      distancematrix: distanceMatrixMock,
    })),
  };
});

beforeEach(() => {
  geocodeMock.mockReset();
  distanceMatrixMock.mockReset();
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
    await createDriver({ minKm: 1 });

    // Mock the external service responses
    const mockOriginGeo = {
      data: {
        results: [
          {
            geometry: { location: { lat: -10.9333, lng: -37.0667 } },
          },
        ],
      },
    };
    const mockDestinationGeo = {
      data: {
        results: [
          {
            geometry: { location: { lat: -10.9167, lng: -37.05 } },
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
                distance: { text: '5 km', value: 5000 },
                duration: { text: '10 mins', value: 600 },
              },
            ],
          },
        ],
      },
    };

    // Mock the behavior of external APIs
    geocodeMock.mockResolvedValueOnce(mockOriginGeo).mockResolvedValueOnce(mockDestinationGeo);
    distanceMatrixMock.mockResolvedValue(mockDistanceMatrix);

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
        distance: expect.any(Number),
        duration: expect.any(Number),
        options: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            vehicle: expect.any(String),
            review: expect.any(Array),
            value: expect.any(String),
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
    const origin = faker.address.streetName();
    const response = await server
      .patch('/ride/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({
        origin: origin,
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
    await createDriver();
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
    const driver = await createDriver({ minKm: 1 });
    const response = await server
      .patch('/ride/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({
        origin: 'Universidade Federal de Sergipe',
        destination: 'Universidade Tiradentes',
        distance: 10,
        duration: 100,
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: 1000,
      });

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
      }),
    );
  });
});
