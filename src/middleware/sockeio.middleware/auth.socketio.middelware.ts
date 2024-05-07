const jwt = require('jsonwebtoken');

import RedisClient from "../../databases/redis";


const authMiddelware = async (socket: any, next: any) => {
    const token = socket.handshake.auth.token;
    try {
        const decoded = await jwt.verify(token, process.env['jwtSecret']);
        if (decoded?.role) {
            const stringUserData:any = await RedisClient.get(token);
            socket.user = JSON.parse(stringUserData);
            return next();
        }
        return socket.disconnect(true);
    } catch (error) {
        console.error(error);
    }
}

export const adminAuthMiddelware = async (socket: any, next: any) => {
    const token = socket.handshake.auth.token;
    try {
        const decoded = await jwt.verify(token, process.env['jwtSecret']);
        if (decoded?.role === "admin") {
            const stringUserData:any = await RedisClient.get(token);
            socket.user = JSON.parse(stringUserData);
            return next();
        }
        return socket.disconnect(true);
    } catch (error) {
        console.error(error);
    }
}



export default authMiddelware;