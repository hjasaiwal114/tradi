import dotenv from 'dotenv';

dotenv.config();

export const config = {
    nodeEnv: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3000,
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    frontendUrl: process.env.FRONTEND_URL || 'http//localhost:3001',
    jwtSecret: process.env.JWT_SECRET || 'supersecret',
    cookieSecret: process.env.COOKIE_SECRET || 'cookiesecret',
    resendApiKey: process.env.RESEND_API_KEY,
    redisHost: process.env.REDIS_HOST || '127.0.0.1',
    redisPort: parseInt(process.env.REDIS_PORT || '6379', 10), 
}
