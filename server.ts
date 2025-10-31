import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { config } from './src/config';
import authRoutes from './src/api/routes/authRoutes';
import userRoutes from './src/api/routes/userRoutes';
import { webSocketKoJodna } from './src/infrastructure/websocket';

// server setup
const app = express();
const httpServer = createServer(app);

// middleware
app.use(express.json());
app.use(cookieParser(config.cookieSecret));

// ----Api routes----
app.use('/api/v1', authRoutes);
app.use('api/v1', userRoutes);

// attach websocket server
webSocketKoJodna(httpServer);

// server startup
httpServer.listen(config.port, () => {
    console.log(`Server (HTTP + Websocket) is running on http://localhost:${config.port}`)   
    console.log(`Current enviroment: ${config.nodeEnv}`);
});
