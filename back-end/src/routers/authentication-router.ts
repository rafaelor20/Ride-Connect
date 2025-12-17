import { Router } from 'express';
import { forgotPasswordPost, resetPasswordPost, signInPost } from '@/controllers';
import { validateBody } from '@/middlewares';
import { forgotPasswordSchema, resetPasswordSchema, signInSchema } from '@/schemas';

const authenticationRouter = Router();

/**
 * @swagger
 * /auth/sign-in:
 *   post:
 *     summary: Sign in a user
 *     description: Authenticates a user and returns a token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
authenticationRouter.post('/sign-in', validateBody(signInSchema), signInPost);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     description: Sends a password reset link to the user's email.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Token sent to email
 *       404:
 *         description: User not found
 */
authenticationRouter.post('/forgot-password', validateBody(forgotPasswordSchema), forgotPasswordPost);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset a user's password
 *     description: Resets a user's password using a token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *             required:
 *               - token
 *               - password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       401:
 *         description: Invalid token
 */
authenticationRouter.post('/reset-password', validateBody(resetPasswordSchema), resetPasswordPost);

export { authenticationRouter };
