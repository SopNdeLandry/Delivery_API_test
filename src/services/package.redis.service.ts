import RedisClient from '../databases/redis/';
import { getPackageById } from './package.service';
import { IPackage } from '../models/package.model'


export const addPackageToRedis = async (packageId: string) => {
    try {
        const currentPackage = await getPackageById(packageId);
        if (currentPackage?.package_id) {
            RedisClient.hSet('active_package', packageId, JSON.stringify(currentPackage));
        }
    } catch (error) {
        console.error(error);
    }
}

export const getPackageFromRedis = async (packageId: string): Promise<IPackage | undefined> => {
    try {
        const stringifyPackageObj = await RedisClient.hGet('active_package', packageId);
        if (stringifyPackageObj) {
            return JSON.parse(stringifyPackageObj);
        }
    } catch (error) {
        console.error(error);
    }
}

export const deletePackageFromRedis = async (packageId: string) => {
    try {
        RedisClient.hDel('active_package', packageId);
    } catch (error) {
        console.error(error);
    }
}