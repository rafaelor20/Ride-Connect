import { Router } from 'express';

import { validateBody } from '@/middlewares';
import { usersPost } from '@/controllers';
import { createCustomerSchema } from '@/schemas';

const usersRouter = Router();

usersRouter.post('/', validateBody(createCustomerSchema), usersPost);

export { usersRouter };
