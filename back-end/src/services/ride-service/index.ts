import { Ride, Customer } from '@prisma/client';
import { Client } from '@googlemaps/google-maps-services-js';
import dotenv from 'dotenv';
//import { createCustomerSchema } from '@/schemas';

import { options } from 'joi';
import userRepository from '../../repositories/user-repository';
import driverRepository from '../../repositories/driver-repository';

const client = new Client({});

async function checkCustomerExists(customerId: string) {
  try {
    const id = parseInt(customerId);
    const customer = await userRepository.findById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  } catch (error) {
    console.error('Error checking if customer exists:', error);
    throw new Error('Invalid customer ID');
  }
}

export async function rideEstimate({ customer_id, origin, destination }: RideEstimateParams) {
  const apiKey = process.env.GOOGLE_API; // Replace with your actual API key.

  try {
    console.log(customer_id, origin, destination);
    const Customer = await checkCustomerExists(customer_id);

    // Get latitude and longitude of origin and destination
    const [originGeo, destinationGeo] = await Promise.all([
      client.geocode({ params: { address: origin, key: apiKey } }),
      client.geocode({ params: { address: destination, key: apiKey } }),
    ]);

    const originLocation = originGeo.data.results[0].geometry.location;
    const destinationLocation = destinationGeo.data.results[0].geometry.location;

    // Get distance and duration between origin and destination
    const distanceMatrix = await client.distancematrix({
      params: {
        origins: [`${originLocation.lat},${originLocation.lng}`],
        destinations: [`${destinationLocation.lat},${destinationLocation.lng}`],
        key: apiKey,
      },
    });

    const distanceInfo = distanceMatrix.data.rows[0].elements[0];

    const drivers = await driverRepository.getDrivers();

    const response = {
      origin: {
        latitude: originLocation.lat,
        longitude: originLocation.lng,
      },
      destination: {
        latitude: destinationLocation.lat,
        longitude: destinationLocation.lng,
      },
      distance: distanceInfo.distance.text,
      duration: distanceInfo.duration.text,
      options: drivers,
      routeResponse: distanceMatrix.data,
    };

    return response;
  } catch (error) {
    console.error('Error fetching ride estimate:', error.message);
    throw new Error('Could not fetch ride estimate');
  }
}

export type RideEstimateParams = { customer_id: string; origin: string; destination: string };

const rideService = {
  rideEstimate,
};

//export * from './errors';
export default rideService;
