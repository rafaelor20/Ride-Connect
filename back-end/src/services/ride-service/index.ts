import { Client } from '@googlemaps/google-maps-services-js';

import { Customer } from '@prisma/client';
import userRepository from '../../repositories/user-repository';
import driverRepository from '../../repositories/driver-repository';
import rideRepository from '../../repositories/ride-repository';

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
    throw new Error('Invalid customer ID');
  }
}

async function checkDriverExists(driverId: string) {
  try {
    const id = parseInt(driverId);
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new Error('Driver not found');
    }
  } catch (error) {
    throw new Error('Invalid driver ID');
  }
}

export async function rideEstimate({ customer_id, origin, destination }: RideEstimateParams) {
  const apiKey = process.env.GOOGLE_API; // Replace with your actual API key.

  try {
    await checkCustomerExists(customer_id);

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

    const drivers = await driverRepository.getDriversWithReviews();

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
      options: drivers.map((driver) => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        review: driver.rides.flatMap((ride) =>
          ride.review.map((review) => ({
            rating: review.rating,
            comment: review.comment,
          })),
        ),
        // In value, Distance is in meters, price in cents
        value: ((distanceInfo.distance.value * driver.pricePerKmInCents) / 100000).toFixed(2),
      })),
      routeResponse: distanceMatrix.data,
    };

    return response;
  } catch (error) {
    console.error('Error fetching ride estimate:', error.message);
    throw new Error('Could not fetch ride estimate');
  }
}

export async function rideConfirm(
  customer_id: string,
  origin: string,
  destination: string,
  distance: string,
  duration: string,
  driver: { id: string; name: string },
  value: string,
) {
  try {
    await checkCustomerExists(customer_id);
    await checkDriverExists(driver.id);

    const ride = await rideRepository.createRide({
      customer_id: parseInt(customer_id),
      origin,
      destination,
      distance,
      duration,
      driver_id: parseInt(driver.id),
      value,
    });
  } catch (error) {
    throw new Error('Invalid customer ID');
  }
}

export type RideEstimateParams = { customer_id: string; origin: string; destination: string };

const rideService = {
  rideEstimate,
  rideConfirm,
};

//export * from './errors';
export default rideService;
