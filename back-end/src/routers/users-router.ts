import { Router } from 'express';

import { validateBody } from '@/middlewares';
import { usersPost } from '@/controllers';
import { createCustomerSchema } from '@/schemas';

const usersRouter = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     description: Creates a new user in the system.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict - email already in use
 *       422:
 *         description: Unprocessable entity
 */
usersRouter.post('/', validateBody(createCustomerSchema), usersPost);

export { usersRouter };
