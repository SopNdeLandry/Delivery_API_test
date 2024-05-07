import Joi = require('joi');

import { IPackage } from '../models/package.model';
import { guidRegex } from '../types/types';

const MAX_SIZE= 20000;
const MAX_WEIGHT = 2000000;
const MIN_SIZE =1; 
const MAX_STRING_SIZE= 100;
const MAX_DESCRIPTION_SIZE = 1000;

export const locationValidation = Joi.object(
    {
        lon: Joi.number().min(-180).max(180).required(),
        lat:Joi.number().min(-90).max(90).required(),
    }
)

export const addPackageValidation = {
    body: Joi.object<IPackage>().keys({
        description: Joi.string().required().max(MAX_DESCRIPTION_SIZE),
        width:Joi.number().min(MIN_SIZE).max(MAX_SIZE),
        weight:Joi.number().min(MIN_SIZE).max(MAX_WEIGHT),
        height:Joi.number().min(MIN_SIZE).max(MAX_SIZE),
        depth: Joi.number().min(MIN_SIZE).max(MAX_SIZE),
        from_name: Joi.string().max(MAX_STRING_SIZE).required(),
        from_address:Joi.string().max(MAX_STRING_SIZE).required(),
        from_location:locationValidation.required(),
        to_name:Joi.string().max(MAX_STRING_SIZE).required(),
        to_address:Joi.string().max(MAX_STRING_SIZE).required(),
        to_location:locationValidation.required(),
    })
}

export const getPackageByIdValidation = {
    params : Joi.object().keys({
        id:Joi.string().required().regex(guidRegex),
    })
}

export const updatePackagesValidation = {
    body: Joi.object<IPackage>().keys({
        package_id:Joi.string().required().regex(guidRegex),
        description: Joi.string().required().max(MAX_DESCRIPTION_SIZE),
        width:Joi.number().min(MIN_SIZE).max(MAX_SIZE),
        weight:Joi.number().min(MIN_SIZE).max(MAX_WEIGHT),
        height:Joi.number().min(MIN_SIZE).max(MAX_SIZE),
        depth: Joi.number().min(MIN_SIZE).max(MAX_SIZE),
        from_name: Joi.string().max(MAX_STRING_SIZE).required(),
        from_address:Joi.string().max(MAX_STRING_SIZE).required(),
        from_location:locationValidation.required(),
        to_name:Joi.string().max(MAX_STRING_SIZE).required(),
        to_address:Joi.string().max(MAX_STRING_SIZE).required(),
        to_location:locationValidation.required(),
    }),
    params :Joi.object().keys({
        id:Joi.string().required().regex(guidRegex),
    })
}

export const deletePackageByIdValidation = {
    params : Joi.object().keys({
        id:Joi.string().required().regex(guidRegex),
    })
}
