import RedisClient from '../databases/redis/';
import { IDelivery } from '../models/delivery.models';
import { Location } from '../models/types';
import { getDeliveryById } from './delivery.service';
import { addPackageToRedis, deletePackageFromRedis } from './package.redis.service';


export const addDeliveryToRedis = async (deliveryId: string) => {
    try {
        const delivery = await getDeliveryById(deliveryId);
        if (delivery?.delivery_id) {
            RedisClient.hSet('active_delivery', delivery.delivery_id, JSON.stringify(delivery));
        }
    } catch (error) {
        console.error(error);
    }
}


export const getDeliveryFromRedis = async (deliveryId: string): Promise<IDelivery | undefined> => {
    try {
        const stringifyDeliveryObj = await RedisClient.hGet('active_delivery', deliveryId);
        if (stringifyDeliveryObj) {
            return JSON.parse(stringifyDeliveryObj);
        }
    } catch (error) {
        console.error(error);
    }
}

export const updateRedisDeliveryStatus = async (deliveryId: string, status: string) => {
    try {
        const stringifyDeliveryObj = await RedisClient.hGet('active_delivery', deliveryId);
        if (stringifyDeliveryObj) {
            const deliveryObj = JSON.parse(stringifyDeliveryObj);
            const deliveryObjWithNewStatus = Object.assign({}, deliveryObj, { status: status });
            switch (status) {
                case 'picked-up':
                    RedisClient.hSet('active_delivery', deliveryId, JSON.stringify(Object.assign({}, deliveryObjWithNewStatus, { pickup_time: Date.now() })));
                    addPackageToRedis(deliveryObj.package_id);
                    break;
                case 'in-transit':
                    RedisClient.hSet('active_delivery', deliveryId, JSON.stringify(Object.assign({}, deliveryObjWithNewStatus, { start_time: Date.now() })));
                    break;
                case 'delivered':
                    deleteDeliveryToRedis(deliveryId);
                    deletePackageFromRedis(deliveryObj.package_id);
                    break;
                case 'failed':
                    deleteDeliveryToRedis(deliveryId);
                    deletePackageFromRedis(deliveryObj.package_id);
                    break;
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export const updateRedisDeliveryLocation = async (deliveryId: string, location: Location) => {
    try {
        const stringifyDeliveryObj = await RedisClient.hGet('active_delivery', deliveryId);
        if (stringifyDeliveryObj) {
            const deliveryObj = JSON.parse(stringifyDeliveryObj);
            const newDeliveryObj = Object.assign({}, deliveryObj, { location: { lon: location.lon, location: location.lat } });
            RedisClient.hSet('active_delivery', deliveryId, JSON.stringify(newDeliveryObj));
        }

    } catch (error) {
        console.error(error);
    }
}



export const deleteDeliveryToRedis = async (deliveryId: string) => {
    try {
        RedisClient.hDel('active_delivery', deliveryId);
    } catch (error) {
        console.error(error);
    }
}



