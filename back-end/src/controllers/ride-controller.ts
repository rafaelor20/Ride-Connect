import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import rideService from '@/services/ride-service';

export async function rideEstimate(req: AuthenticatedRequest, res: Response) {
  try {
    const { origin, destination } = req.body;
    const customer_id = Number(req.userId);

    const ride = await rideService.rideEstimate({ customer_id, origin, destination });

    return res.status(httpStatus.OK).send(ride);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}

export async function rideConfirm(req: AuthenticatedRequest, res: Response) {
  try {
    const { origin, destination, distance, duration, driver, value } = req.body;
    //const customer_id = String(req.userId);
    const customer_id = req.userId;
    const ride = await rideService.rideConfirm(customer_id, origin, destination, distance, duration, driver, value);

    return res.status(httpStatus.OK).send(ride);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}

export async function getRidesByCustomerId(req: AuthenticatedRequest, res: Response) {
  try {
    const { driver_id } = req.query;
    const { userId } = req;

    let rides;
    if (driver_id !== undefined) {
      rides = await rideService.getRidesByCustomerAndDriverId(userId, Number(driver_id));
    } else {
      rides = await rideService.getRidesByCustomerId(String(userId));
    }
    return res.status(httpStatus.OK).send({ rides });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}
