import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function rideEstimate(req: Request, res: Response) {
  const { cusomerId, origin, destination } = req.body;
  try {
    const user = await userService.createUser({ name, email, password });
    return res.status(httpStatus.CREATED).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    if (error.name === 'DuplicatedEmailError') {
      return res.status(httpStatus.CONFLICT).send(error.message);
    }

    if (error.name === 'ValidationError') {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.message);
    }

    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
