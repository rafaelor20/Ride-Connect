import { Router } from 'express';

import { createCustomerSchema } from '@/schemas';
import { validateBody } from '@/middlewares';
import { usersPost } from '@/controllers';

const usersRouter = Router();

usersRouter.post('/', validateBody(createCustomerSchema), usersPost);

export { usersRouter };
