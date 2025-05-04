import Redis from 'ioredis';

// connection to redis for fast access of data from database just like cache frequent data is stored
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD});


redisClient.on('connect', () => {
  console.log('Connected to Redis server');
});

export default redisClient;