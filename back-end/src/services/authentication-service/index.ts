import { Customer } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { invalidCredentialsError } from './errors';
import userRepository from '@/repositories/user-repository';
import sessionRepository from '@/repositories/session-repository';
import { exclude } from '@/utils/prisma-utils';

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, 'password'),
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    customerId: userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

export type SignInParams = Pick<Customer, 'email' | 'password'>;

type SignInResult = {
  user: Pick<Customer, 'id' | 'email'>;
  token: string;
};

type GetUserOrFailResult = Pick<Customer, 'id' | 'email' | 'password'>;

const authenticationService = {
  signIn,
};

export default authenticationService;
export * from './errors';
