import { createClient } from "redis";
const defaultRedisUri: string = 'redis://:masterpassword123@127.0.0.1:7000';
const RedisClient = createClient({url:process.env['redisUri'] || defaultRedisUri});
//Redis sharded Pub/Sub

export const pubClient = createClient({url:process.env['redisUri'] || defaultRedisUri});
export const subClient = pubClient.duplicate();

RedisClient.on('error', (err) => console.log('Redis Client Error', err));

RedisClient.connect();

//Redis sharded Pub/Sub

Promise.all([
    pubClient.connect(),
    subClient.connect()
  ]);

export default RedisClient;
