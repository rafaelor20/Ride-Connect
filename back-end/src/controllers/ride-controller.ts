import { send } from 'process';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import rideService from '@/services/ride-service';

export async function rideEstimate(req: Request, res: Response) {
  try {
    const { customer_id, origin, destination } = req.body;

    const ride = await rideService.rideEstimate({ customer_id, origin, destination });

    return res.status(httpStatus.OK).send(ride);
  } catch (error) {
    if (error.message === 'Invalid customer ID') {
      error.error_code = 'INVALID_DATA';
      error.error_description = 'Invalid customer ID';
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }

    if (error.message === 'Origin and destination are required') {
      error.error_code = 'INVALID_DATA';
      error.error_description = 'Origin and destination are required';
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    if (error.message === 'Origin and destination cannot be the same') {
      error.error_code = 'INVALID_DATA';
      error.error_description = 'Origin and destination cannot be the same';
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    error.error_code = 'INVALID_DATA';
    error.error_description = 'Something is wrong';

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
      error.error_code = 'INVALID_DATA';
      error.error_description = error.message;
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    if (error.message === 'Origin and destination are required') {
      error.error_code = 'INVALID_DATA';
      error.error_description = error.message;
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    if (error.message === 'Origin and destination cannot be the same') {
      error.error_code = 'INVALID_DATA';
      error.error_description = error.message;
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    if (error.message === 'Invalid driver ID') {
      error.error_code = 'INVALID_DATA';
      error.error_description = error.message;
      return res.status(400).send(error);
    }

    if (error.message === 'Driver Not Found') {
      error.error_code = 'Driver Not Found';
      error.error_description = error.message;
      return res.status(404).send(error);
    }

    if (error.message === 'Distance is less than the minimum allowed') {
      error.error_code = 'INVALID_DISTANCE';
      error.error_description = error.message;
      return res.status(406).send(error);
    }

    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getRidesByCustomerId(req: Request, res: Response) {
  try {
    const { customer_id } = req.params;
    const { driver_id } = req.query;

    if (customer_id == null || customer_id == undefined) {
      throw new Error('Invalid customer ID');
    }

    let rides;
    if (driver_id == null || driver_id == undefined) {
      rides = await rideService.getRidesByCustomerId(String(customer_id));
      return res.status(httpStatus.OK).send(rides);
    }

    rides = await rideService.getRidesByCustomerAndDriverId(String(customer_id), String(driver_id));
    return res.status(httpStatus.OK).send(rides);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      error.error_code = 'UNAUTHORIZED';
      error.error_description = error.message;
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }

    if (error.message === 'Invalid customer ID') {
      error.error_code = 'INVALID_DATA';
      error.error_description = error.message;
      return res.status(400).send(error);
    }

    if (error.message === 'Customer not found') {
      error.error_code = 'INVALID_DATA';
      error.error_description = 'Customer not found';
      return res.status(400).send(error);
    }

    if (error.message === 'NO_RIDES_FOUND') {
      error.error_code = error.message;
      error.error_description = 'No rides found';
      return res.status(404).send(error);
    }

    //Invalid driver ID
    if (error.message === 'Invalid driver ID') {
      error.error_code = 'INVALID_DRIVER';
      error.error_description = error.message;
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    //Driver not found
    if (error.message === 'Driver not found') {
      error.error_code = 'INVALID_DRIVER';
      error.error_description = error.message;
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    error.error_code = 'INVALID_DATA';
    error.error_description = error.message;
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
