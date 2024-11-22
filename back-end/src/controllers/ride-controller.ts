import { Request, Response } from 'express';
import httpStatus from 'http-status';
import rideService from '@/services/ride-service';

export async function rideEstimate(req: Request, res: Response) {
  const { cusomerId, origin, destination } = req.body;
  try {
    const ride = await rideService.rideEstimate({ customer_id: cusomerId, origin, destination });

    console.log('Ride estimate:', ride);
    return res.status(httpStatus.OK).send(ride);
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
