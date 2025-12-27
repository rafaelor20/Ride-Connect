import { Request, Response } from 'express';
import { Customer } from '@prisma/client';
import httpStatus from 'http-status';
import authenticationService, { ForgotPasswordParams, SignInParams } from '@/services/authentication-service';

export async function signInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).json({
      token: result.token,
      id: result.user.id,
      email: result.user.email,
    });
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

export async function forgotPasswordPost(req: Request, res: Response) {
  const { email } = req.body as ForgotPasswordParams;

  try {
    const token = await authenticationService.forgotPassword(email);

    if (process.env.NODE_ENV === 'test') {
      return res.status(httpStatus.OK).send({ token });
    }

    return res.status(httpStatus.OK).send({ message: 'Token sent to email' });
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function resetPasswordPost(req: Request, res: Response) {
  const { token, password } = req.body as Pick<Customer, 'password'> & { token: string };

  try {
    await authenticationService.resetPassword({ token, password });

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === 'InvalidCredentialsError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
