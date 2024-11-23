import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createCustomer, createSession, createDriver } from '../factories';
import 