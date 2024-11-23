import * as jwt from 'jsonwebtoken';
import { Customer } from '@prisma/client';

import { createCustomer } from './factories';
import { createSession } from './factories/sessions-factory';
import { prisma } from '@/config';

export async function cleanDb() {
  await prisma.review.deleteMany({});
  await prisma.ride.deleteMany({});
  await prisma.origin.deleteMany({});
  await prisma.destination.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.driver.deleteMany({});
}

export async function generateValidToken(user?: Customer) {
  const incomingUser = user || (await createCustomer());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}
