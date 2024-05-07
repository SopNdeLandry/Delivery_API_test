import { Router } from 'express';

import validate from '../../middleware/validate';
import * as deliveryController from '../../controllers/delivery.controller';
import { addDeliveryValidation, getDeliveryByIdValidation, updateDeliveryValidation, deletePackageByIdValidation } from '../../validations/delivery.validations'; 
import authMiddleware  from '../../middleware/authMiddleware';

/**
 * @swagger
 * tags:
 *   name: Delivery
 *   description: Operations related to delivery
 */

const deliveryRouter = Router();
/**
 * @swagger
 * /api/v1/delivery:
 *   post:
 *     tags:
 *       - Delivery
 *     summary: Create a new delivery
 *     description: Creates a new delivery with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               delivery_id:
 *                 type: string
 *                 description: The ID of the delivery.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               package_id:
 *                 type: string
 *                 description: The ID of the package.
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *               pickup_time:
 *                 type: string
 *                 format: date-time
 *                 description: The pickup time of the delivery.
 *                 example: "2022-05-01T12:00:00Z"
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: The start time of the delivery.
 *                 example: "2022-05-01T12:00:00Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 description: The end time of the delivery.
 *                 example: "2022-05-01T12:00:00Z"
 *               location:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     description: The latitude of the delivery location.
 *                     example: 37.7749
 *                   longitude:
 *                     type: number
 *                     description: The longitude of the delivery location.
 *                     example: -122.4194
 *                 required:
 *                   - latitude
 *                   - longitude
 *               status:
 *                 type: string
 *                 description: The status of the delivery.
 *                 example: "in_progress"
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 delivery_id:
 *                   type: string
 *                   description: The ID of the newly created delivery.
 *                   example: "123e4567-e89b-12d3-a456-426614174002"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: "Internal server error"
 */
  
deliveryRouter.post('/delivery', authMiddleware(['createDelivery']), validate(addDeliveryValidation), deliveryController.createNewDelivery);
/**
 * @swagger
 * /api/v1/delivery:
 *   get:
 *     tags:
 *      - Delivery
 *     summary: Get all deliveries
 *     description: Retrieves a list of all deliveries.
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   delivery_id:
 *                     type: string
 *                     description: The ID of the delivery.
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   package_id:
 *                     type: string
 *                     description: The ID of the package.
 *                     example: "123e4567-e89b-12d3-a456-426614174001"
 *                   pickup_time:
 *                     type: string
 *                     format: date-time
 *                     description: The pickup time of the delivery.
 *                     example: "2022-05-01T12:00:00Z"
 *                   start_time:
 *                     type: string
 *                     format: date-time
 *                     description: The start time of the delivery.
 *                     example: "2022-05-01T12:00:00Z"
 *                   end_time:
 *                     type: string
 *                     format: date-time
 *                     description: The end time of the delivery.
 *                     example: "2022-05-01T12:00:00Z"
 *                   location:
 *                     type: object
 *                     properties:
 *                       latitude:
 *                         type: number
 *                         description: The latitude of the delivery location.
 *                         example: 37.7749
 *                       longitude:
 *                         type: number
 *                         description: The longitude of the delivery location.
 *                         example: -122.4194
 *                     required:
 *                       - latitude
 *                       - longitude
 *                   status:
 *                     type: string
 *                     description: The status of the delivery.
 *                     example: "in_progress"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: "Internal server error"
 */

deliveryRouter.get('/delivery',authMiddleware(['getAllDelivery']) ,deliveryController.getAllDelivery);

/**
 * @swagger
 * /api/v1/delivery/{id}:
 *   get:
 *     tags:
 *      - Delivery
 *     summary: Get a package by ID
 *     description: Retrieves a package by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the package.
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 delivery_id:
 *                   type: string
 *                   description: The ID of the delivery.
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 package_id:
 *                   type: string
 *                   description: The ID of the package.
 *                   example: "123e4567-e89b-12d3-a456-426614174001"
 *                 pickup_time:
 *                   type: string
 *                   format: date-time
 *                   description: The pickup time of the delivery.
 *                   example: "2022-05-01T12:00:00Z"
 *                 start_time:
 *                   type: string
 *                   format: date-time
 *                   description: The start time of the delivery.
 *                   example: "2022-05-01T12:00:00Z"
 *                 end_time:
 *                   type: string
 *                   format: date-time
 *                   description: The end time of the delivery.
 *                   example: "2022-05-01T12:00:00Z"
 *                 location:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       description: The latitude of the delivery location.
 *                       example: 37.7749
 *                     longitude:
 *                       type: number
 *                       description: The longitude of the delivery location.
 *                       example: -122.4194
 *                   required:
 *                     - latitude
 *                     - longitude
 *                 status:
 *                   type: string
 *                   description: The status of the delivery.
 *                   example: "in_progress"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: "Internal server error"
 */
  
deliveryRouter.get('/delivery/:id', authMiddleware(['viewDelivery']), validate(getDeliveryByIdValidation), deliveryController.getDeliveryById);

/**
 * @swagger
 * /api/v1/delivery/{id}:
 *   put:
 *     tags:
 *      - Delivery
 *     summary: Update a delivery by ID
 *     description: Updates a delivery with the provided data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the delivery to update.
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *       - in: body
 *         name: delivery
 *         required: true
 *         description: The updated delivery object.
 *         schema:
 *           type: object
 *           properties:
 *             delivery_id:
 *               type: string
 *               description: The ID of the delivery.
 *               example: "123e4567-e89b-12d3-a456-426614174000"
 *             package_id:
 *               type: string
 *               description: The ID of the package.
 *               example: "123e4567-e89b-12d3-a456-426614174001"
 *             pickup_time:
 *               type: string
 *               format: date-time
 *               description: The pickup time of the delivery.
 *               example: "2022-05-01T12:00:00Z"
 *             start_time:
 *               type: string
 *               format: date-time
 *               description: The start time of the delivery.
 *               example: "2022-05-01T12:00:00Z"
 *             end_time:
 *               type: string
 *               format: date-time
 *               description: The end time of the delivery.
 *               example: "2022-05-01T12:00:00Z"
 *             location:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                   description: The latitude of the delivery location.
 *                   example: 37.7749
 *                 longitude:
 *                   type: number
 *                   description: The longitude of the delivery location.
 *                   example: -122.4194
 *               required:
 *                 - latitude
 *                 - longitude
 *             status:
 *               type: string
 *               description: The status of the delivery.
 *               example: "in_progress"
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 delivery_id:
 *                   type: string
 *                   description: The ID of the updated delivery.
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 package_id:
 *                   type: string
 *                   description: The ID of the package.
 *                   example: "123e4567-e89b-12d3-a456-426614174001"
 *                 pickup_time:
 *                   type: string
 *                   format: date-time
 *                   description: The pickup time of the delivery.
 *                   example: "2022-05-01T12:00:00Z"
 *                 start_time:
 *                   type: string
 *                   format: date-time
 *                   description: The start time of the delivery.
 *                   example: "2022-05-01T12:00:00Z"
 *                 end_time:
 *                   type: string
 *                   format: date-time
 *                   description: The end time of the delivery.
 *                   example: "2022-05-01T12:00:00Z"
 *                 location:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       description: The latitude of the delivery location.
 *                       example: 37.7749
 *                     longitude:
 *                       type: number
 *                       description: The longitude of the delivery location.
 *                       example: -122.4194
 *                   required:
 *                     - latitude
 *                     - longitude
 *                 status:
 *                   type: string
 *                   description: The status of the delivery.
 *                   example: "in_progress"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: "Internal server error"
 */
deliveryRouter.put('/delivery/:id', authMiddleware(['updateDelivery']), validate(updateDeliveryValidation),deliveryController.updatedDelivery );
/**
 * @swagger
 * /api/v1/delivery/{id}:
 *   delete:
 *     tags:
 *      - Delivery
 *     summary: Delete a delivery by ID
 *     description: Deletes a delivery by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the delivery to delete.
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 delivery_id:
 *                   type: string
 *                   description: The ID of the deleted delivery.
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 package_id:
 *                   type: string
 *                   description: The ID of the package.
 *                   example: "123e4567-e89b-12d3-a456-426614174001"
 *                 pickup_time:
 *                   type: string
 *                   format: date-time
 *                   description: The pickup time of the delivery.
 *                   example: "2022-05-01T12:00:00Z"
 *                 start_time:
 *                   type: string
 *                   format: date-time
 *                   description: The start time of the delivery.
 *                   example: "2022-05-01T12:00:00Z"
 *                 end_time:
 *                   type: string
 *                   format: date-time
 *                   description: The end time of the delivery.
 *                   example: "2022-05-01T12:00:00Z"
 *                 location:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       description: The latitude of the delivery location.
 *                       example: 37.7749
 *                     longitude:
 *                       type: number
 *                       description: The longitude of the delivery location.
 *                       example: -122.4194
 *                   required:
 *                     - latitude
 *                     - longitude
 *                 status:
 *                   type: string
 *                   description: The status of the delivery.
 *                   example: "in_progress"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: "Internal server error"
 */

deliveryRouter.delete('/delivery/:id', authMiddleware(['deleteDelivery']), validate(deletePackageByIdValidation), deliveryController.deleteDelivery);

export default deliveryRouter; 