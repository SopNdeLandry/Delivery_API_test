import Package from "../models/package.model";
import { IPackage } from '../models/package.model';

export const addPackage = async (packageObj: IPackage): Promise<string | undefined> => {
    try {
        const newPackage = new Package(packageObj);
        const savePackage = await newPackage.save();
        return savePackage.toJSON().package_id;
    } catch (error) {
        console.error(error)
    }

}

export const getPackageById = async (packageId: any): Promise<IPackage | undefined> => {
    try {
        const findPackage = await Package.findOne({ package_id: packageId });
        if (findPackage?.package_id) {
            return findPackage.toJSON();
        }
        throw new Error('package not found ');
    } catch (error) {
        console.error(error);
    }
}

export const getAllPackage = async (): Promise<IPackage[] | undefined> => {
    try {
        const packages = await Package.find();
        return packages.map((item) => {
            return item.toJSON();
        })
    } catch (error) {
        console.error(error);
    }
}

interface IPagination {
    packages: IPackage[];
    count: number
}

export const getPackagePagination = async (startDate: Date, endDate: Date, skip = 0, limit = 10): Promise<IPagination | undefined> => {
    try {
        const count = await Package.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } });
        const packagesDoc = await Package.find({ createdAt: { $gte: startDate, $lte: endDate } }).skip(skip).limit(limit).sort({ createdAt: -1 });
        const packages = packagesDoc.map((item) => {
            return item.toJSON();
        })
        return Object.assign({}, { count: count }, { packages: packages })
    } catch (error) {
        console.error(error);
    }
}

export const updatePackage = async (currentPackage: IPackage): Promise<IPackage | undefined> => {
    try {
        const foundPackage = await Package.findOneAndUpdate(
            { package_id: currentPackage.package_id },
            {
                $set: {
                    active_delivery_id: currentPackage.active_delivery_id,
                    description: currentPackage.description,
                    width: currentPackage.width,
                    weight: currentPackage.weight,
                    depth: currentPackage.depth,
                    from_name: currentPackage.from_address,
                    from_address: currentPackage.from_address,
                    from_location: currentPackage.from_location,
                    to_name: currentPackage.to_name,
                    to_address: currentPackage.to_name,
                    to_location: currentPackage.to_location,
                }
            },
            {
                returnDocument: 'after',
            });
        return foundPackage?.toJSON();
    } catch (error) {
        console.error(error);
    }
}

export const linkDeliveryAndPackage = async (packageId: string, DeliveryId: string) => {
    try {
        const updatedPacakge = await Package.findOneAndUpdate(
            { package_id: packageId },
            {
                $set:{
                    active_delivery_id: DeliveryId,
                }
            },
            {
                returnDocument: 'after',
            }
        );
        return updatedPacakge?.toJSON();
    } catch (error) {
        console.error(error)
    }
}


export const deletePackage = async (packageId: string): Promise<IPackage | undefined> => {
    try {
        const deletedPackage = await Package.findOneAndDelete({ package_id: packageId });
        return deletedPackage?.toJSON();
    } catch (error) {
        console.error(error);
    }
}