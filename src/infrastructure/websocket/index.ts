import { WebSocketServer, WebSocket} from 'ws';
import Redis from 'ioredis';
import { config } from '../../config';

// seperate client for subsrribing because it can only listen for message
const resdisKaPanjiKaran = new Redis({
    host: config.redisHost,
    port: config.redisPort,
    maxRetriesPerRequest: null,
});

const  REDIS_CHANNEL = 'price-updates';

// create a websocket server. ye attach hoga apne main server se 

const wss = new WebSocketServer({noServer: true});

// set efficient way to store and manage all active client connection
const connnectedHueClients = new Set<WebSocket>();

wss.on('connection', (ws: WebSocket) => {
    console.log('client connected to websocket');

    // client adding
    connnectedHueClients.add(ws);

    wss.on('close', () => {
        console.log('client diconnected from websocket')
    });
    
});
console.log('websocket serer initialised.');

// redis k subscription logic
resdisKaPanjiKaran.on('connect', () => {
     console.log('connected to redis for subscribing');
     resdisKaPanjiKaran.subscribe(REDIS_CHANNEL, (err, count) => {
        if (err) {
            console.error('failed to subscribe to redis chanel:', err);
            return;
        }
        console.log(`subscribed to ${count} redis chanel(s). listening for price update`);
    });
});

// this is the core logic: when a message arrives from redis        
resdisKaPanjiKaran.on('message', (channel, message) => {
    // we only care about message on our specific channel
    if (channel === REDIS_CHANNEL) {
        // broadcast it to evvery single connected client;
        for (const client of connnectedHueClients) {
            // clients khula hua h?
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    }
});

resdisKaPanjiKaran.on('error', (err) => {
    console.error('redis subscriber error:', err);
});

// export a function to attach the websocket server to our https server
export const webSocketKoJodna = (server: import('http').Server) => {
    server.on('upgrade',(request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });
};
