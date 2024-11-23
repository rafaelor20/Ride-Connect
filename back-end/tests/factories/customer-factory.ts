import bcrypt from 'bcrypt';
import faker from '@faker-js/faker';
import { Customer } from '@/models/customer';
import { prisma } from '@/config';

export async function createCustomer(params: Partial<Customer> = {}): Promise<Customer> {
  const incomingPassword = params.password || faker.internet.password(6);
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);

  return prisma.customer.create({
    data: {
      name: params.name || faker.name.findName(),
      email: params.email || faker.internet.email(),
      password: hashedPassword,
    },
  });
}
