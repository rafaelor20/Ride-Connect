import { Session } from '@prisma/client';
import { createCustomer } from './customer-factory';
import { prisma } from '@/config';

export async function createSession(token: string): Promise<Session> {
  const user = await createCustomer();

  return prisma.session.create({
    data: {
      token,
      customerId: user.id,
    },
  });
}
