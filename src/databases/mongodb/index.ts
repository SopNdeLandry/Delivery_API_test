import  mongoose  from "mongoose";

const defautDataBaseUri : string = 'mongodb://127.0.0.1:27017/delivery'

const connectMongoDb = ():void  =>{
    mongoose.connect(`${process.env['mongoDbUri'] ?? defautDataBaseUri}`).catch((err)=>{
        console.error(err);
    });
}


export default connectMongoDb;