import { Router } from 'express';

import { createCustomerSchema } from '@/schemas';
import { validateBody } from '@/middlewares';
import { rideEstimate, rideConfirm } from '@/controllers';

const rideRouter = Router();

rideRouter.post('/estimate', rideEstimate);
rideRouter.patch('/confirm', rideConfirm);

export { rideRouter };
