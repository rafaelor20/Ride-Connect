import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { rideEstimateSchema, rideConfirmSchema } from '@/schemas';
import { rideEstimate, rideConfirm, getRidesByCustomerId } from '@/controllers';

const rideRouter = Router();

/**
 * @swagger
 * /ride/estimate:
 *   post:
 *     summary: Get a ride estimate
 *     description: Returns an estimate for a ride based on origin and destination.
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *             required:
 *               - origin
 *               - destination
 *     responses:
 *       200:
 *         description: Ride estimate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 origin:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                     longitude:
 *                       type: number
 *                 destination:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                     longitude:
 *                       type: number
 *                 distance:
 *                   type: number
 *                 duration:
 *                   type: number
 *                 options:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       vehicle:
 *                         type: string
 *                       review:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             rating:
 *                               type: number
 *                             comment:
 *                               type: string
 *                       value:
 *                         type: number
 *                 routeResponse:
 *                   type: object
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
rideRouter.post('/estimate', authenticateToken, validateBody(rideEstimateSchema), rideEstimate);

/**
 * @swagger
 * /ride/confirm:
 *   patch:
 *     summary: Confirm a ride
 *     description: Confirms a ride and creates it in the database.
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *               distance:
 *                 type: number
 *               duration:
 *                 type: number
 *               driver:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   name:
 *                     type: string
 *                   image:
 *                     type: string
 *               value:
 *                 type: number
 *             required:
 *               - origin
 *               - destination
 *               - distance
 *               - duration
 *               - driver
 *               - value
 *     responses:
 *       200:
 *         description: Ride confirmed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
rideRouter.patch('/confirm', authenticateToken, validateBody(rideConfirmSchema), rideConfirm);

/**
 * @swagger
 * /ride:
 *   get:
 *     summary: Get rides by customer
 *     description: Get all rides for the authenticated customer, optionally filtered by driver.
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: driver_id
 *         schema:
 *           type: string
 *         description: ID of the driver to filter rides by
 *     responses:
 *       200:
 *         description: A list of rides
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  rides:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: number
 *                        customerId:
 *                          type: number
 *                        driverId:
 *                          type: number
 *                        originId:
 *                          type: number
 *                        destinationId:
 *                          type: number
 *                        distanceInKm:
 *                          type: number
 *                        durationInSec:
 *                          type: number
 *                        valueInCents:
 *                          type: number
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *       401:
 *         description: Unauthorized
 */
rideRouter.get('/', authenticateToken, getRidesByCustomerId);

export { rideRouter };
