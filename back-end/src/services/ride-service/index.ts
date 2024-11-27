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
    if (isNaN(id)) {
      throw new Error('Invalid driver ID');
    }
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new Error('Driver Not Found');
    }
    return driver;
  } catch (error) {
    throw new Error(error.message);
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

  if (!driver) {
    throw new Error('Driver not found');
  }

  if (driver.minKm > parseFloat(distance)) {
    throw new Error('Distance is less than the minimum allowed');
  }
}

function DistanceStrToNumber(distance: string) {
  const distanceNumber = parseFloat(distance.replace(' km', '').replace(',', '.'));
  return distanceNumber;
}

export async function rideEstimate({ customer_id, origin, destination }: RideEstimateParams) {
  const apiKey = process.env.GOOGLE_API_KEY; // Replace with your actual API key.

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
      options: drivers
        .filter((driver) => driver.minKm <= distanceInfo.distance.value / 1000) // Filter drivers based on minKm
        .map((driver) => ({
          id: driver.id,
          name: driver.name,
          description: driver.description,
          vehicle: driver.vehicle,

          review: drivers[driver.id - 1].rides[0].review[0]
            ? {
                rating: drivers[driver.id - 1].rides[0].review[0].rating,
                comment: drivers[driver.id - 1].rides[0].review[0].comment,
              }
            : { rating: null, comment: '' },
          // Distance is in meters, price in km * cents, value in km * currency
          value: ((distanceInfo.distance.value * driver.pricePerKmInCents) / 100000).toFixed(2),
        }))
        .sort((a, b) => parseFloat(a.value) - parseFloat(b.value)), // Sort by value
      routeResponse: distanceMatrix.data,
    };

    return response;
  } catch (error) {
    if (error.message === 'Invalid customer ID') {
      throw new Error('Invalid customer ID');
    }
    if (error.message === 'Origin and destination are required') {
      throw new Error('Origin and destination are required');
    }
    if (error.message === 'Origin and destination cannot be the same') {
      throw new Error('Origin and destination cannot be the same');
    }
    console.error('Error fetching ride estimate:', error.message);
    throw new Error(error.message);
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

    // Check the distance by driver
    await checkDistanceByDriver(driverDB.id, distance);

    const originAddress = await originRepository.createOrigin({ address: origin });
    const destinationAddress = await destinationRepository.createDestination({
      address: destination,
    });

    await rideRepository.createRide({
      customerId: parseInt(customer_id),
      originId: originAddress.id,
      destinationId: destinationAddress.id,
      distanceInKm: parseInt(distance),
      durationInSec: parseInt(duration),
      driverId: parseInt(driver.id),
      valueInCents: parseInt(value),
    });

    const response = { success: true };
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getRidesByCustomerId(customer_id: string) {
  try {
    const customer = await checkCustomerExists(customer_id);
    const rides = await rideRepository.findByCustomerId(customer.id);

    if (rides.length === 0) {
      throw new Error('NO_RIDES_FOUND');
    }

    return rides;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getRidesByCustomerAndDriverId(customer_id: string, driver_id: string) {
  try {
    const customer = await checkCustomerExists(customer_id);
    const driver = await checkDriverExists(driver_id);
    const rides = await rideRepository.findByCustomerAndDriverId(customer.id, driver.id);

    if (rides.length === 0) {
      throw new Error('NO_RIDES_FOUND');
    }

    return rides;
  } catch (error) {
    throw new Error(error.message);
  }
}

export type RideEstimateParams = { customer_id: string; origin: string; destination: string };

const rideService = {
  rideEstimate,
  rideConfirm,
  getRidesByCustomerId,
  getRidesByCustomerAndDriverId,
};

export default rideService;
