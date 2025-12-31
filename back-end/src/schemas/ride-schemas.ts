import Joi from 'joi';
import { RideEstimateParams, RideConfirmParams } from '@/services/ride-service';

export const rideEstimateSchema = Joi.object<RideEstimateParams>({
  origin: Joi.string().required(),
  destination: Joi.string().required(),
});

export const rideConfirmSchema = Joi.object<RideConfirmParams>({
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  distance: Joi.number().required(),
  duration: Joi.number().required(),
  driver: { id: Joi.number().required(), name: Joi.string().required() },
  value: Joi.number().required(),
});
