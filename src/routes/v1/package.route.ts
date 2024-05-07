import { Router } from 'express';

import validate from '../../middleware/validate';
import * as packageController from '../../controllers/package.controller';
import { addPackageValidation, getPackageByIdValidation, updatePackagesValidation , deletePackageByIdValidation} from '../../validations/package.validation';
import authMiddleware  from '../../middleware/authMiddleware';

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Operations related to packages
 */

const packageRouter = Router();
/**
 * @swagger
 * /api/v1/package:
 *   get:
 *     tags:
 *      - Packages 
 *     description: Get a list of all packages
 *     responses:
 *       200:
 *         description: A list of all packages
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               package_id:
 *                 type: string
 *               active_delivery_id:
 *                 type: string
 *               description:
 *                 type: string
 *               weight:
 *                 type: number
 *               width:
 *                 type: number
 *               height:
 *                 type: number
 *               depth:
 *                 type: number
 *               from_name:
 *                 type: string
 *               from_address:
 *                  type: string
 *               from_location:
 *                  type: object   
 *                  properties:
 *                      lon:
 *                         type:number
 *                      lat:
 *                          type:number
 *               to_name:
 *                  type: string
 *               to_address:
 *                  type: string
 *               to_location:
 *                  type: object
 */
packageRouter.get('/package',authMiddleware(['getAllPackage']) ,packageController.getAllPackage);
/**
 * @swagger
 * /api/v1/package:
 *   post:
 *     tags:
 *      - Packages
 *     summary: Create a new package
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               weight:
 *                 type: number
 *               width:
 *                 type: number
 *               height:
 *                 type: number
 *               depth:
 *                 type: number
 *               from_name:
 *                 type: string
 *               from_address:
 *                 type: string
 *               from_location:
 *                 type: object
 *               to_name:
 *                 type: string
 *               to_address:
 *                 type: string
 *               to_location:
 *                 type: object
 *             required:
 *               - description
 *               - weight
 *               - width
 *               - height
 *               - depth
 *               - from_name
 *               - from_address
 *               - from_location
 *               - to_name
 *               - from_name
 *               - to_address
 *               - to_location
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 package_id:
 */

packageRouter.post('/package',authMiddleware(['createPackage']), validate(addPackageValidation), packageController.addPackage);
/**
 * @typedef {object} Location
 * @property {number} lat - The latitude of the location.
 * @property {number} lon - The longitude of the location.
 */

/**
 * @swagger
 * /api/v1/packages/{id}:
 *   get:
 *     tags:
 *      - Packages
 *     summary: Get a package by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the package to retrieve
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 package_id:
 *                   type: string
 *                   format: uuid
 *                 active_delivery_id:
 *                   type: string
 *                   format: uuid
 *                 description:
 *                   type: string
 *                 weight:
 *                   type: number
 *                 width:
 *                   type: number
 *                 height:
 *                   type: number
 *                 depth:
 *                   type: number
 *                 from_name:
 *                   type: string
 *                 from_address:
 *                   type: string
 *                 to_name:
 *                   type: string
 *                 to_address:
 *                   type: string
 */
packageRouter.get('/package/:id',authMiddleware(['viewPackage']) ,validate(getPackageByIdValidation), packageController.getPackageById);
/**
 * @swagger
 * /api/v1/packages/{id}:
 *   put:
 *     tags:
 *      - Packages
 *     summary: Update a package by ID
 *     description: Update a package with the given ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the package to update
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: Access token for authentication
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from_location:
 *                 type: object
 *                 properties:
 *                   lon:
 *                     type: number
 *                   lat:
 *                     type: number
 *               to_location:
 *                 type: object
 *                 properties:
 *                   lon:
 *                     type: number
 *                   lat:
 *                     type: number
 *               _id:
 *                 type: string
 *               package_id:
 *                 type: string
 *               description:
 *                 type: string
 *               width:
 *                 type: number
 *               weight:
 *                 type: number
 *               height:
 *                 type: number
 *               depth:
 *                 type: number
 *               from_name:
 *                 type: string
 *               from_address:
 *                 type: string
 *               to_name:
 *                 type: string
 *               to_address:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Updated package object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from_location:
 *                   type: object
 *                   properties:
 *                     lon:
 *                       type: number
 *                     lat:
 *                       type: number
 *                 to_location:
 *                   type: object
 *                   properties:
 *                     lon:
 *                       type: number
 *                     lat:
 *                       type: number
 *                 _id:
 *                   type: string
 *                 package_id:
 *                   type: string
 *                 description:
 *                   type: string
 *                 width:
 *                   type: number
 *                 weight:
 *                   type: number
 *                 height:
 *                   type: number
 *                 depth:
 *                   type: number
 *                 from_name:
 *                   type: string
 *                 from_address:
 *                   type: string
 *                 to_name:
 *                   type: string
 *                 to_address:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: number
 */


packageRouter.put('/package/:id',authMiddleware(['updatePackage']), validate(updatePackagesValidation), packageController.updatePackage );
/**
 * @swagger
 * /api/v1/packages/{id}:
 *   delete:
 *     tags:
 *      - Packages
 *     summary: Delete a package by ID
 *     description: Delete a package with the given ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the package to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Package deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: package delete
 *       '404':
 *         description: Package not found or deletion failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: fail request
 */
packageRouter.delete('/package/:id',authMiddleware(['deletePackage']),validate(deletePackageByIdValidation), packageController.deletePackage );

export default packageRouter;