import Joi from 'joi';
import { Customer } from '@prisma/client';
import { ForgotPasswordParams, SignInParams } from '@/services';

export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object<ForgotPasswordParams>({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object<Pick<Customer, 'password'> & { token: string }>({
  token: Joi.string().required(),
  password: Joi.string().required(),
});
