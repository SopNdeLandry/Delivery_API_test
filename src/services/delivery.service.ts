import Delivery from '../models/delivery.models';
import { IDelivery } from '../models/delivery.models';
import { Location } from '../models/types';


export const addDelivery = async (delivery: IDelivery): Promise<string | undefined> => {
    try {
        const newDelivery = new Delivery(delivery);
        const savedDelivery = await newDelivery.save();
        return savedDelivery.toJSON().delivery_id;
    } catch (error) {
        console.log(error);
    }
}


export const getAllDelivery = async (): Promise<IDelivery[] | undefined> => {
    try {
        const delivery = await Delivery.find();
        return delivery.map((item) => {
            return item.toJSON();
        })
    } catch (error) {
        console.log(error);
    }
}


export const getDeliveryById = async (deliveryId: string): Promise<IDelivery | undefined> => {
    try {
        const delivery = await Delivery.findOne({ delivery_id: deliveryId });
        if (delivery?.delivery_id) {
            return delivery.toJSON();
        }
    } catch (error) {
        console.log(error);
    }
}

export const udpadeDelivery = async (deliveryObject: IDelivery): Promise<IDelivery | undefined> => {
    try {
        const updatingDelivery = await Delivery.findOneAndUpdate(
            { delivery_id: deliveryObject.delivery_id },
            {
                $set: {
                    delivery_id: deliveryObject.delivery_id,
                    package_id: deliveryObject.package_id,
                    pickup_time: deliveryObject.pickup_time,
                    start_time: deliveryObject.start_time,
                    end_time: deliveryObject.end_time,
                    location: deliveryObject.location,
                    status: deliveryObject.status
                }
            },
            { returnDocument: 'after', }
        );
        return updatingDelivery?.toJSON();
    } catch (error) {
        console.log(error);
    }
}

type LogicStatus = {
    "open": number,
    "picked-up": number,
    "in-transit": number,
    "delivered": number,
    "failed": number,
};


export const updateDeliveryStatus = async (deliveryId: string, status: string): Promise<string | undefined> => {
    const statusValue = {
        "picked-up": "pickup_time",
        "in-transit": "start_time",
        "delivered": "end_time",
        "failed": "end_time"
    }
    const statusLogic:LogicStatus = {
        "open": 0,
        "picked-up": 1,
        "in-transit": 2,
        "delivered": 3,
        "failed": 3,
    };

    try {
        if (!Object.keys(statusValue).includes(status)) {
            throw new Error(`Invalid status: ${status}`);
        }
        const deliveryObj = await getDeliveryById(deliveryId);
        if (deliveryObj?.delivery_id) {
            //@ts-ignore
            if (statusLogic[`${deliveryObj.status}`] < statusLogic[`${status}`]) {
                const updatedDelivery = await Delivery.findOneAndUpdate(
                    { delivery_id: deliveryId },
                    {
                        $set: {
                            status: status,
                            //@ts-ignore
                            [statusValue[status]]: Date.now()
                        }
                    },
                    { returnDocument: 'after', }
                );
                //@ts-ignore
                console.log({ [statusValue[status]]: Date.now() })
                return updatedDelivery?.toJSON().delivery_id;
            }
            console.log('****** IGNORE UPTATE   ********* ');
            return;
        }
        console.log('  delivery doesnt exit in database ');
        return;
    } catch (error) {
        console.log(error);
    }
}

export const updateDeliveryLocation = async (deliveryId: string, location: Location): Promise<string | undefined> => {
    try {
        const updatedDelivery = await Delivery.findOneAndUpdate(
            { delivery_id: deliveryId },
            { $set: { location: location } },
            { returnDocument: 'after', }
        );
        return updatedDelivery?.toJSON().delivery_id;
    } catch (error) {
        console.log(error);
    }
}

export const deleteDelivery = async (deliveryId: string): Promise<string | undefined> => {
    try {
        const deletedDelivery = await Delivery.findOneAndDelete({ delivery_id: deliveryId });
        return deletedDelivery?.toJSON().delivery_id;
    } catch (error) {
        console.log(error);
    }
}