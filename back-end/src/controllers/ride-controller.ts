import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import rideService from '@/services/ride-service';

export async function rideEstimate(req: AuthenticatedRequest, res: Response) {
  try {
    const { origin, destination } = req.body;
    const id = req.userId;

    if (id == null || id == undefined) {
      throw new Error('Invalid customer ID');
    }

    const customer_id = String(id);
    console.log('rideEstimate', { customer_id, origin, destination });

    const ride = await rideService.rideEstimate({ customer_id, origin, destination });

    return res.status(httpStatus.OK).send(ride);
  } catch (error) {
    if (error.message === 'Invalid customer ID') {
      return res.status(httpStatus.UNAUTHORIZED).send(error);

      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
}

export async function rideConfirm(req: AuthenticatedRequest, res: Response) {
  try {
    const { origin, destination, distance, duration, driver, value } = req.body;
    const { userId } = req;
    if (userId == null || userId == undefined) {
      throw new Error('Invalid customer ID');
    }
    const customer_id = String(userId);
    const ride = await rideService.rideConfirm(customer_id, origin, destination, distance, duration, driver, value);

    return res.status(httpStatus.OK).send(ride);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getRidesByCustomerId(req: AuthenticatedRequest, res: Response) {
  try {
    const { customer_id } = req.params;
    const { driver_id } = req.query;
    const { userId } = req;

    if (customer_id == null || customer_id == undefined) {
      return res.status(httpStatus.UNAUTHORIZED).send('Unauthorized');
    }

    if (customer_id != String(userId)) {
      return res.status(httpStatus.UNAUTHORIZED).send('Unauthorized');
    }

    let rides;

    if (driver_id == null || driver_id == undefined) {
      rides = await rideService.getRidesByCustomerId(customer_id);
      return res.status(httpStatus.OK).send(rides);
    }

    rides = await rideService.getRidesByCustomerAndDriverId(customer_id, driver_id as string);

    return res.status(httpStatus.OK).send(rides);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
