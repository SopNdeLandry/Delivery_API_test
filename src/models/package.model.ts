import { Schema, model } from 'mongoose';
import { Guid } from 'js-guid';

import { Location } from './types';


export interface IPackage {
    package_id: string ;//guid
    active_delivery_id: string; //guid
    description: string; 
    weight: number;
    width: number;
    height: number; 
    depth: number;
    from_name: string;
    from_address: string;
    from_location: Location;
    to_name:string;
    to_address:string;
    to_location:Location;
}

const packageSchema = new Schema<IPackage>({
    package_id: {
        type:String, 
        required: true , 
        unique:true,
        validate:{
            validator:(v:string)=>{
                return Guid.isValid(v);
            },
            message:(props)=> `${props.value} is not a valid ID!`
        }
    },
    active_delivery_id: {
        type:String, 
        validate:{
            validator:(v:string)=>{
                return Guid.isValid(v);
            },
            message:(props)=> `${props.value} is not a valid ID!`
        }
    },
    description:{ type: String, required:true, maxlength:1000},
    width:{type:Number, required:true, min:1, max:20000},
    weight:{type:Number, required:true, min:1, max:2000000},
    height:{type:Number, required:true, min:1, max:20000},
    depth:{type:Number, required:true, min:1, max:20000},
    from_name:{ type:String, required:true, maxlength:100},
    from_address:{type:String, require:true, maxlength:100},
    from_location:{
        lon:{type:Number, required:true},
        lat:{type: Number, required:true}
    },
    to_name:{type:String, required:true, maxlength:100},
    to_address:{type:String, required:true, maxlength:100},
    to_location:{
        lon:{type:Number, required:true},
        lat:{type: Number, required:true}
    }
},{ timestamps: true });

const Package = model<IPackage>('Package',packageSchema );

export default Package;