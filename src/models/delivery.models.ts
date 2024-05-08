import { Schema, model } from 'mongoose';
import { Guid } from 'js-guid';

import { Location } from './types';

const timestamp = 1680316800000; // April 1, 2024, 00:00:00 UTC in milliseconds

export interface IDelivery {
    delivery_id: string; //guid
    package_id: string; //guid
    pickup_time?: Date;
    start_time: Date;
    end_time?: Date;
    location: Location;
    status?: 'open' | 'picked-up' | 'in-transit' | 'delivered' | 'failed'
}

//Ajouter des contraintes de gestion de status et de time au niveau de la bd
//Ajouter la gestion de contraintes au niveau des temps start-time, pick-up time etc... 
//Ajouter la gestion de contraintes au niveau des changements de status.

const deliverySchema = new Schema<IDelivery>({
    delivery_id: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v: string) => {
                return Guid.isValid(v);
            },
            message: (props) => `${props.value} is not a valid id`
        }
    },
    package_id: {
        type: String,
        required: true,
        validate: {
            validator: (v: string) => {
                return Guid.isValid(v);
            },
            message: (props) => `${props.value} is not a valid id`
        }
    },
    pickup_time: { type: Date, min: timestamp },
    start_time: { type: Date, min: timestamp },
    end_time: { type: Date, min: timestamp },
    location: {
        lon: { type: Number },
        lat: { type: Number }
    },
    status: {
        type: String,
        enum: ['open', 'picked-up', 'in-transit', 'delivered', 'failed'],
        require: true,
        default: 'open'
    }
}, { timestamps: true });

const Delivery = model<IDelivery>('Delivery', deliverySchema);

export default Delivery;