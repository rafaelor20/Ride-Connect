import { Request, Response } from 'express';
import httpStatus from 'http-status';
import rideService from '@/services/ride-service';

export async function rideEstimate(req: Request, res: Response) {
  const { customer_id, origin, destination } = req.body;
  try {
    const ride = await rideService.rideEstimate({ customer_id, origin, destination });

    return res.status(httpStatus.OK).send(ride);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function rideConfirm(req: Request, res: Response) {
  const { customer_id, origin, destination, distance, duration, driver, value } = req.body;
  try {
    const ride = await rideService.rideConfirm(customer_id, origin, destination, distance, duration, driver, value);

    return res.status(httpStatus.OK).send(ride);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getRidesByCustomerId(req: Request, res: Response) {
  
  try {

    const { customer_id } = req.params;
    const { driver_id } = req.query;

    if(customer_id == null || customer_id == undefined) {
      return res.status(httpStatus.BAD).send('Invalid customer ID');
    }

    let rides

    if ( driver_id == null || driver_id == undefined ) {
      rides = await rideService.getRidesByCustomerId(customer_id);
      return res.status(httpStatus.OK).send(rides);
    }

    rides = await rideService.getRidesByCustomerAndDriverId(customer_id, driver_id);

    return res.status(httpStatus.OK).send(rides);
  
  } catch (error) {
    return res.status(httpStatus.BAD).send(error);
  }
}

