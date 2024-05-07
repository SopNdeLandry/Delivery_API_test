
import {Location } from '../models/types';
import { updateDeliveryStatus , updateDeliveryLocation } from './delivery.service';
import { updateRedisDeliveryStatus, updateRedisDeliveryLocation } from './delivery.redis.service';


export const updateDeliveryStatusBusinessLogic = async (deliveryId: string, status:string) =>{
    updateRedisDeliveryStatus(deliveryId, status);
    updateDeliveryStatus(deliveryId,status);
}


export const updateDeliveryLocationBusinessLogic = async (deliveryId:string, location :Location) =>{
    updateRedisDeliveryLocation(deliveryId,location);
    updateDeliveryLocation(deliveryId,location);
}