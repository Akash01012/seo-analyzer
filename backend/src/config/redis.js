const Redis = require("ioredis");

console.log("HOST:", process.env.REDIS_HOST);
console.log("PORT:", process.env.REDIS_PORT);
console.log("PASSWORD:", process.env.REDIS_PASSWORD ? "FOUND" : "NOT FOUND");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: {},
  maxRetriesPerRequest: null,
});

module.exports = redis;