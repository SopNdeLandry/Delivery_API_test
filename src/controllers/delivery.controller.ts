import type { Request, Response } from 'express';
const httpStatus = require('http-status');
import { Guid } from 'js-guid';

import * as deliveryService from '../services/delivery.service';
import * as delliveryRedisService from '../services/delivery.redis.service';
import { linkDeliveryAndPackage } from '../services/package.service';

export const createNewDelivery = async (req: Request, res: Response) => {
    const deliveryId = Guid.newGuid();
    const newDelivery = Object.assign({}, { delivery_id: deliveryId }, req.body);
    try {
        const newDeliveryId = await deliveryService.addDelivery(newDelivery);
        if(newDeliveryId){
            linkDeliveryAndPackage(req.body.package_id, newDeliveryId);
        }
        return res.json({ delivery_id: newDeliveryId });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

// @ts-ignore
export const getAllDelivery = async (req: Request, res: Response) => {
    try {
        const arrayOfDelivery = await deliveryService.getAllDelivery();
        return res.json(arrayOfDelivery);
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export const getDeliveryById = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const deliveryObj = await delliveryRedisService.getDeliveryFromRedis(req.params['id']);
        if(deliveryObj?.delivery_id){
            return res.json(deliveryObj);   
        }
        // @ts-ignore
        const delivery = await deliveryService.getDeliveryById(req.params['id']);
        if (delivery?.delivery_id) {
            return res.json(delivery);
        }
        return res.status(httpStatus.BAD_REQUEST).json({
            message: 'delivery not found'
        })
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export const updatedDelivery = async (req: Request, res: Response) => {
    const id = req.params['id'];
    const newDeliveryObj = Object.assign({}, { delivery_id: id }, req.body);
    try {
        const newUpdatedDelivery = await deliveryService.udpadeDelivery(newDeliveryObj);
        if (newUpdatedDelivery?.delivery_id) {
            return res.json(newUpdatedDelivery);
        }
        return res.status(httpStatus.BAD_REQUEST).json({
            message: 'delivery not updated'
        })
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export const deleteDelivery = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const deletedDeliveryId = await deliveryService.deleteDelivery(req.params['id']);
        if (deletedDeliveryId) {
            return res.json({ delivery_id: deletedDeliveryId })
        }
        return res.status(httpStatus.BAD_REQUEST).json({
            message: 'Delete operation error'
        })
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}