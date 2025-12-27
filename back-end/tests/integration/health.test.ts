jest.mock('@googlemaps/google-maps-services-js', () => ({
  Client: jest.fn(() => ({
    distancematrix: jest.fn(() => Promise.resolve({})),
  })),
}));

import httpStatus from 'http-status';
import supertest from 'supertest';
import app, { init, close } from '@/app';

beforeAll(async () => {
  await init();
});

afterAll(async () => {
  await close();
});

const server = supertest(app);

describe('GET /health', () => {
  it('should respond with status 200 with OK! text', async () => {
    const response = await server.get('/health');

    expect(response.status).toBe(httpStatus.OK);
    expect(response.text).toBe('OK!');
  });
});
