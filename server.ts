import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import cookieParser from 'cookie-parser';
import {config} from './src/config';
import authRoutes from './src/api/routes/authRoutes';

const app = express();

app.use(express.json());

app.use(cookieParser(config.cookieSecret));

app.use('/api/v1', authRoutes);

app.listen(config.port, () => {
    console.log(`Server is running on https://localhost:${config.port}`);
    console.log(`Current enviroment: ${config.nodeEnv}`);
});
