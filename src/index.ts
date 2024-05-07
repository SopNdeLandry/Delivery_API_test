const { createShardedAdapter } = require('@socket.io/redis-adapter');
require('dotenv/config');
const http = require('http');
const https = require('https');
const socketIo = require('socket.io');
const path = require("path");
const fs = require('fs');

import app from './app';
import connectMongoDb from './databases/mongodb';
import authMiddelware, { adminAuthMiddelware } from './middleware/sockeio.middleware/auth.socketio.middelware';
import { pubClient, subClient } from './databases/redis';
import { Location } from './models/types';
import { getDeliveryFromRedis } from './services/delivery.redis.service';
import { updateDeliveryStatusBusinessLogic, updateDeliveryLocationBusinessLogic } from './services/business.delivery';

connectMongoDb();

const privateKey = fs.readFileSync(path.resolve(__dirname, '../https_keys/testapp_pro.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, '../https_keys/testapp_pro.crt'), 'utf8');
const ca = fs.readFileSync(path.resolve(__dirname, '../https_keys/testapp_pro.ca-bundle'), 'utf8');
const credentials = { key: privateKey, cert: certificate, ca: ca };

const HTTPS_Server = https.createServer(credentials, app); //HTTS server;
const httpserver = http.createServer(app);

const io = socketIo((process.env['node_env'] === 'production') ? HTTPS_Server : httpserver, {
  cors: {
    origin: `${process.env['PROTOCOL']}://${process.env['HOST']}:${process.env['PORT']}`,
    methods: ["GET", "POST"],
    credentials: true
  },
  adapter: createShardedAdapter(pubClient, subClient) //Redis sharded Pub/Sub
}
);

const adminNameSpace = io.of('/admin');  // administrator secure namespace. 
//@ts-ignore
io.use(authMiddelware);
adminNameSpace.use(adminAuthMiddelware); // admin namespace Authentification. 

io.on('connection', (socket: any) => {
  socket.on('joinRoom', (roomName: string) => {
    socket.join(roomName);
  });
  socket.on('status_changed', async (roomName: string, status: string) => {
    socket.to(roomName).emit('status_changed', status);
    const delivery = await getDeliveryFromRedis(roomName);
    socket.broadcast.emit("delivery_updated", delivery);
    updateDeliveryStatusBusinessLogic(roomName, status);
  });
  socket.on('location_changed', (roomName: string, locationObj: Location) => {
    socket.to(roomName).emit('location_changed', locationObj);
    updateDeliveryLocationBusinessLogic(roomName, locationObj);
  })
});

(process.env['node_env'] === 'production')
  ?
  HTTPS_Server.listen(process.env['PORT'], () => {
    console.log(` ****PRODUCTION**** Server is running on Port: ${process.env['PORT']}, ${process.env['HOST']}`);
    console.log(`${process.env['PROTOCOL']}://${process.env['HOST']}:${process.env['PORT']}/`);
  })
  :
  httpserver.listen(process.env['PORT'], () => {
    console.log(`***___DEV___***  Server is running on Port: ${process.env['PORT']}, ${process.env['HOST']}`);
    console.log(`${process.env['PROTOCOL']}://${process.env['HOST']}:${process.env['PORT']}/`);
  });
