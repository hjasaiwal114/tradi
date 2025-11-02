// config.ts
import dotenv from "dotenv";
dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || "dev",
  port: parseInt(process.env.PORT || "3000", 10),
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3001", 
  jwtSecret: process.env.JWT_SECRET || "supersecret",
  cookieSecret: process.env.COOKIE_SECRET || "cookiesecret",
  resendApiKey: process.env.RESEND_API_KEY,
  redisHost: process.env.REDIS_HOST || "127.0.0.1",
  redisPort: parseInt(process.env.REDIS_PORT || "6379", 10),
  pubSub: {
    redisUrl: process.env.REDIS_URL,  
    stream: process.env.REDIS_STREAM,
  },
  flushIntervalMs: parseInt(process.env.FLUSH_MS || '200', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  symbolDefaults: {
    BTCUSDT: { decimals: 2 },
    ETHUSDT: { decimals: 2 },
  },
};

export default config;

