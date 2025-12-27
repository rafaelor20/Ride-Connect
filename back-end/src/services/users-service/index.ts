import * as bcrypt from 'bcrypt';
import { Customer } from '@prisma/client';
import { duplicatedEmailError } from './errors';
import userRepository from '@/repositories/user-repository';
import { createCustomerSchema } from '@/schemas';

export async function createUser({ name, email, password }: CreateCustomerParams): Promise<Customer> {
  await validateUniqueEmailOrFail(email);

  await validateCreateUserParamsOrFail({ name, email, password });

  const hashedPassword = await bcrypt.hash(password, 12);
  return userRepository.create({
    name,
    email,
    password: hashedPassword,
  });
}

async function validateUniqueEmailOrFail(email: string) {
  const userWithSameEmail = await userRepository.findByEmail(email);
  if (userWithSameEmail) {
    throw duplicatedEmailError();
  }
}

async function validateCreateUserParamsOrFail(params: CreateCustomerParams) {
  await createCustomerSchema.validateAsync(params);
}

export type CreateCustomerParams = Pick<Customer, 'name' | 'email' | 'password'>;

const userService = {
  createUser,
};

export * from './errors';
export default userService;
