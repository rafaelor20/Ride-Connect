import { Customer } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { emailService } from '../email-service';
import { invalidCredentialsError, notFoundError } from '@/errors';
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

function getRandom(min = 0, max = 9): number {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCode(): string {
  const list: number[] = [];

  while (list.length < 4) {
    const n: number = getRandom();
    if (!list.includes(n)) list.push(n);
  }

  const generatedCode = `${list[0]}${list[1]}${list[2]}${list[3]}`;

  return generatedCode;
}

async function forgotPassword(email: string): Promise<string> {
  const user = await userRepository.findByEmail(email);
  if (!user) throw notFoundError();

  const token = generateCode();

  await userRepository.update(user.id, { token });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await emailService.sendEmail(
    user.email,
    'Password Reset',
    `Click here to reset your password: <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>`,
  );

  return 'Token sent to email';
}

async function resetPassword(params: ResetPasswordParams): Promise<void> {
  const { token, password } = params;

  try {
    const user = await userRepository.findByToken(token);
    if (!user) throw notFoundError();
    if (user.token !== token) throw invalidCredentialsError();

    const hashedPassword = await bcrypt.hash(password, 12);

    await userRepository.update(user.id, {
      password: hashedPassword,
      token: null,
    });
  } catch (error) {
    if (error.name === 'NotFoundError') {
      throw notFoundError();
    }
    throw invalidCredentialsError();
  }
}

export type SignInParams = Pick<Customer, 'email' | 'password'>;
export type ForgotPasswordParams = Pick<Customer, 'email'>;
export type ResetPasswordParams = Pick<Customer, 'password'> & { token: string };

type SignInResult = {
  user: Pick<Customer, 'id' | 'email'>;
  token: string;
};

type GetUserOrFailResult = Pick<Customer, 'id' | 'email' | 'password'>;

const authenticationService = {
  signIn,
  forgotPassword,
  resetPassword,
};

export default authenticationService;
export * from '../../errors/invalid-credentials-error';
