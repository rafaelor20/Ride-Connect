import { Router } from 'express';

import { createCustomerSchema } from '@/schemas';
import { validateBody } from '@/middlewares';
import { rideEstimate } from '@/controllers';

const rideRouter = Router();

rideRouter.post('/estimate', rideEstimate);

export { rideRouter };
