import type { Request, Response } from 'express';
import httpStatus = require('http-status');
import { Guid } from 'js-guid';

import * as packageService from '../services/package.service';
import * as packageRedisService from '../services/package.redis.service';


export const addPackage = async (req: Request, res: Response) => {
    const package_id = Guid.newGuid();
    const newPackage = Object.assign({}, { package_id: package_id }, req.body);
    try {
        const newPackageId = await packageService.addPackage(newPackage);
        res.json({ package_id: newPackageId });
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({
            message: 'bad request',
        })
    }
}

export const getPackageById = async (req: Request, res: Response) => {
    const package_id = req.params['id'];
    try {
        //@ts-ignore
        const packageObj = await packageRedisService.getPackageFromRedis(package_id);
        if(packageObj?.package_id){
            return res.json(packageObj);
        }
        const foundPackage = await packageService.getPackageById(package_id);
        if(foundPackage?.package_id){
           return res.json(foundPackage);
        }
        res.status(httpStatus.BAD_REQUEST).json({
            message:'package not found'
        })
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const getAllPackage = async (req: Request, res: Response) => {
    try {
        const arrOfpackages = await packageService.getAllPackage();
        res.json(arrOfpackages);
        req;
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export const updatePackage = async (req: Request, res: Response) => {
        const id = req.params['id'];
        const packagesForUpdate = Object.assign({},{package_id:id},req.body);
    try {
        const updatedPackages = await packageService.updatePackage(packagesForUpdate);
        if(updatedPackages?.package_id){
            return res.json(updatedPackages);
        }
        return res.status(400).json({message:'fail request'});
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export const deletePackage = async (req: Request, res: Response) => {
    const package_id = req.params['id'];
    try {
        // @ts-ignore
        const deletedPackages = await packageService.deletePackage(package_id);
        if(deletedPackages?.package_id){
            return res.json({message:'package delete'});
        }
        return res.status(400).json({message:'fail request'});
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}
