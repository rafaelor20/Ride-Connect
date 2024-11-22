import { Ride } from '@prisma/client';
import bcrypt from 'bcrypt';
//import { createCustomerSchema } from '@/schemas';

export async function rideEstimate({ custome_id, origin, destination }: RideEstimateParams) {}

export type RideEstimateParams = { custome_id: string; origin: string; destination: string };

const userService = {
  rideEstimate,
};

//export * from './errors';
export default userService;
