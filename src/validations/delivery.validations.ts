const Joi = require('joi');

import { guidRegex } from '../types/types';

export const locationValidation = Joi.object(
    {
        lon: Joi.number().min(-180).max(180).required(),
        lat:Joi.number().min(-90).max(90).required(),
    }
)

const validStatus=['open','picked-up','in-transit','delivered','failed']; 

export const addDeliveryValidation = {
    body: Joi.object().keys({
        delivery_id: Joi.string().regex(guidRegex),
        package_id: Joi.string().required().regex(guidRegex),
        pickup_time: Joi.date().timestamp(),
        start_time: Joi.date().timestamp().required(),
        end_time:Joi.date().timestamp(),
        location:locationValidation.required(),
        status: Joi.string().valid(...validStatus)
    })
}

export const getDeliveryByIdValidation = {
    params : Joi.object().keys({
        id:Joi.string().required().regex(guidRegex),
    })
}

export const updateDeliveryValidation = {
    body: Joi.object().keys({
        delivery_id: Joi.string().regex(guidRegex).required(),
        package_id: Joi.string().required().regex(guidRegex),
        pickup_time: Joi.date().timestamp(),
        start_time: Joi.date().timestamp().required(),
        end_time:Joi.date().timestamp(),
        location:locationValidation.required(),
        status: Joi.string().valid(...validStatus)
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
