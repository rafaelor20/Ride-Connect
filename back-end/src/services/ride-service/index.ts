import { Client } from '@googlemaps/google-maps-services-js';

import userRepository from '../../repositories/user-repository';
import driverRepository from '../../repositories/driver-repository';
import rideRepository from '../../repositories/ride-repository';
import originRepository from '../../repositories/origin-repository';
import destinationRepository from '../../repositories/destination-repository';

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
      throw new Error('Invalid driver ID');
    }
    return driver;
  } catch (error) {
    throw new Error('Invalid driver ID');
  }
}

function checkOriginAndDestination(origin: string, destination: string) {
  if (!origin || !destination) {
    throw new Error('Origin and destination are required');
  }

  if (origin == destination) {
    throw new Error('Origin and destination cannot be the same');
  }
}

async function checkDistanceByDriver(driverId: number, distance: string) {
  const driver = await driverRepository.findById(driverId);

  if (driver.minKm > parseInt(distance)) {
    throw new Error('Distance is less than the minimum allowed');
  }
}

function DistanceStrToNumber(distance: string) {
  const distanceNumber = parseFloat(distance.replace(' km', '').replace(',', '.'));
  return distanceNumber;
}

export async function rideEstimate({ customer_id, origin, destination }: RideEstimateParams) {
  const apiKey = process.env.GOOGLE_API; // Replace with your actual API key.

  try {
    checkOriginAndDestination(origin, destination);
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
      distance: DistanceStrToNumber(distanceInfo.distance.text),
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
        // In value, Distance is in meters, price in cents, value in km/currency
        value: ((distanceInfo.distance.value * driver.pricePerKmInCents) / 100000).toFixed(2),
      })),
      routeResponse: distanceMatrix.data,
    };
    console.log(response);

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
    checkOriginAndDestination(origin, destination);
    await checkCustomerExists(customer_id);
    const driverDB = await checkDriverExists(driver.id);

    checkDistanceByDriver(driverDB.minKm, distance);

    const originAdress = await originRepository.createOrigin({ address: origin });
    const destinationAdress = await destinationRepository.createDestination({
      address: destination,
    });

    await rideRepository.createRide({
      customerId: parseInt(customer_id),
      originId: originAdress.id,
      destinationId: destinationAdress.id,
      distanceInKm: parseInt(distance),
      durationInSec: parseInt(duration),
      driverId: parseInt(driver.id),
      valueInCents: parseInt(value),
    });

    const response = { sucess: true };

    return response;
  } catch (error) {
    throw new Error('Invalid customer ID');
  }
}

export async function getRidesByCustomerId(customer_id: string) {
  try {
    const customer = await checkCustomerExists(customer_id);
    const rides = await rideRepository.findByCustomerId(customer.id);

    return rides;
  } catch (error) {
    throw new Error('Error in getRidesByCustomerId');
  }
}

export async function getRidesByCustomerAndDriverId(customer_id: string, driver_id: string) {
  try {
    const customer = await checkCustomerExists(customer_id);
    const driver = await checkDriverExists(driver_id);
    const rides = await rideRepository.findByCustomerAndDriverId(customer.id, driver.id);

    return rides;
  } catch (error) {
    throw new Error('Error in getRidesByCustomerAndDriverId');
  }
}

export type RideEstimateParams = { customer_id: string; origin: string; destination: string };

const rideService = {
  rideEstimate,
  rideConfirm,
  getRidesByCustomerId,
  getRidesByCustomerAndDriverId,
};

//export * from './errors';
export default rideService;
