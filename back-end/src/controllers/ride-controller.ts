import { Request, Response } from 'express';
import httpStatus from 'http-status';
import rideService from '@/services/ride-service';

export async function rideEstimate(req: Request, res: Response) {
  const { cusomerId, origin, destination } = req.body;
  try {
    const ride = await rideService.rideEstimate({ customer_id: cusomerId, origin, destination });

    return res.status(httpStatus.OK).send(ride);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
