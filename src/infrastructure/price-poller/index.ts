import WebSocket from 'ws';
import Redis from 'ioredis';
import { config } from '../../config';

const BACKPACK_WS_URL = 'wss://ws.backpack.exchange/';
const REDIS_CHANNEL = 'price-updates';
const PUBLISH_INTERVAL_MS = 100;

// Define the assets to track and their decimal precision for integer conversion.
const ASSETS_TO_TRACK = new Map<string, { decimals: number }>([
  ['SOL_USDC', { decimals: 6 }], // e.g., $140.55 -> 140550000
  ['BTC_USDC', { decimals: 4 }], // e.g., $70123.45 -> 701234500
  ['ETH_USDC', { decimals: 4 }], // e.g., $3500.12 -> 35001200
]);

// --- State Management ---

const latestPrices = new Map<string, { price: number; decimal: number }>();

const lastKnownOrderbook = new Map<string, { bestBid: number | null; bestAsk: number | null }>();


// --- Redis Client ---
const redisPublisher = new Redis({
  host: config.redisHost,
  port: config.redisPort,
  maxRetriesPerRequest: null, 
});

redisPublisher.on('connect', () => {
  console.log('✅ Connected to Redis for publishing.');
});
redisPublisher.on('error', (err) => {
  console.error('❌ Redis publisher error:', err);
});


// --- WebSocket Client Logic ---
const connectToBackpack = () => {
  const ws = new WebSocket(BACKPACK_WS_URL);

  ws.on('open', () => {
    console.log('✅ WebSocket connection to Backpack opened.');
    // Subscribe to the depth stream for each asset using the correct format
    for (const symbol of ASSETS_TO_TRACK.keys()) {
      ws.send(
        JSON.stringify({
          method: 'SUBSCRIBE',
          params: [`depth.${symbol}`],
          id: 1, 
        }),
      );
      console.log(`📨 Sent subscription for ${symbol}`);
    }
  });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      // Ignore non-data messages (like subscription confirmations)
      if (message.event || !message.data) {
        if(message.event === 'subscribed'){
            console.log(`✅ Successfully subscribed to channel: ${message.channel}`);
        }
        return;
      }
      
      // Process price data from the "depth" stream
      if (message.stream && message.stream.startsWith('depth.')) {
        const symbol = message.stream.replace('depth.', ''); // e.g., "SOL_USDC"
        const assetInfo = ASSETS_TO_TRACK.get(symbol);
        
        if (!assetInfo) return; // Ignore symbols we are not tracking

        // Initialize the orderbook state for this symbol if it's the first time
        if (!lastKnownOrderbook.has(symbol)) {
          lastKnownOrderbook.set(symbol, { bestBid: null, bestAsk: null });
        }
        const currentOrderbook = lastKnownOrderbook.get(symbol)!;

        if (message.data.a && message.data.a.length > 0) {
          currentOrderbook.bestAsk = parseFloat(message.data.a[0][0]);
        }

        if (message.data.b && message.data.b.length > 0) {
          currentOrderbook.bestBid = parseFloat(message.data.b[0][0]);
        }

        if (currentOrderbook.bestBid !== null && currentOrderbook.bestAsk !== null) {
          const midPrice = (currentOrderbook.bestBid + currentOrderbook.bestAsk) / 2;
          const priceAsInteger = Math.round(midPrice * 10 ** assetInfo.decimals);

          latestPrices.set(symbol.split('_')[0], {
            price: priceAsInteger,
            decimal: assetInfo.decimals,
          });
        }
      }
    } catch (error) {
      console.error('❌ Failed to parse WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.warn('⚠️ WebSocket connection closed. Reconnecting in 5 seconds...');
    setTimeout(connectToBackpack, 5000);
  });

  ws.on('error', (err) => {
    console.error('❌ WebSocket error:', err.message);
  });
};


// --- Aggregation and Publishing Logic ---
const startPublisher = () => {
  console.log(`🚀 Starting Redis publisher. Updates will be sent every ${PUBLISH_INTERVAL_MS}ms.`);
  
  setInterval(async () => {
    // If no new prices were calculated in the last interval, do nothing
    if (latestPrices.size === 0) {
      return;
    }

    // Convert the map of latest prices into the required array format
    const priceUpdates = Array.from(latestPrices.entries()).map(([asset, data]) => ({
      asset,
      price: data.price,
      decimal: data.decimal,
    }));
    
    // Clear the map to begin collecting the next batch of updates
    latestPrices.clear();

    const payload = {
      price_updates: priceUpdates,
    };

    try {
      // Publish the payload to the specified Redis channel
      await redisPublisher.publish(REDIS_CHANNEL, JSON.stringify(payload));
      console.log(`📦 Published ${priceUpdates.length} price updates to Redis.`);
    } catch (error) {
      console.error('❌ Failed to publish to Redis:', error);
    }
  }, PUBLISH_INTERVAL_MS);
};


// --- Start the Service ---
connectToBackpack();
startPublisher();
