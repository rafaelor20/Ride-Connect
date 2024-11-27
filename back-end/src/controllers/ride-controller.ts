import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import rideService from '@/services/ride-service';

export async function rideEstimate(req: Request, res: Response) {
  try {
    const { customer_id, origin, destination } = req.body;

    const ride = await rideService.rideEstimate({ customer_id, origin, destination });

    return res.status(httpStatus.OK).send(ride);
  } catch (error) {
    if (error.message === 'Invalid customer ID') {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }

    if (error.message === 'Origin and destination are required') {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    if (error.message === 'Origin and destination cannot be the same') {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function rideConfirm(req: Request, res: Response) {
  try {
    const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

    const ride = await rideService.rideConfirm(customer_id, origin, destination, distance, duration, driver, value);

    return res.status(httpStatus.OK).send(ride);
  } catch (error) {
    if (error.message === 'Invalid customer ID') {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }

    if (error.message === 'Origin and destination are required') {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    if (error.message === 'Origin and destination cannot be the same') {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    if (error.message === 'Invalid driver ID') {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    if (error.message === 'Distance is less than the minimum allowed') {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getRidesByCustomerId(req: Request, res: Response) {
  try {
    const { customer_id } = req.params;
    const { driver_id } = req.query;

    let rides;
    if (driver_id == null || driver_id == undefined) {
      rides = await rideService.getRidesByCustomerId(String(customer_id));
      return res.status(httpStatus.OK).send(rides);
    }

    rides = await rideService.getRidesByCustomerAndDriverId(String(customer_id), String(driver_id));
    return res.status(httpStatus.OK).send(rides);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
