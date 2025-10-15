import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from './src/config';
import authRoutes from './src/api/routes/authRoutes';
import userRoutes from './src/api/routes/userRoutes';

const app = express();

// middleware;;;
app.use(express.json());

app.use(cookieParser(config.cookieSecret));

// ----Api routes----
app.use('/api/v1', authRoutes);
app.use('api/v1', userRoutes);



app.listen(config.port, () => {
  console.log(`Server is running on https://localhost:${config.port}`);
  console.log(`Current enviroment: ${config.nodeEnv}`);
});
