import Redis from "ioredis";
import { config } from "../../config";
import { PriceMessage, NormalisePrice } from "../../shared/types/price";
import { metric } from "./metric";
import { colesac} from "./priceStore";

const redis = new Redis(config.pubSub.redisUrl);

// validator / parse
function parseAndValidate(fields: string[]): NormalisePrice | null {
    try{ 
        const msg: Partial<PriceMessage> = {};
        for (let i = 0; i< fields.length; i += 2) {
            msg[fields[i]] = fields[i+1];
        }
        if (!msg.symbol || msg.price) {
            metric.messageDrropped.inc({reason: 'mission_field'});
            return null;
        }
        const decimals = msg.decimals ?? config.symbolDefaults[msg.symbol]?.decimal;
        if(decimals === undefined) {
            metric.messageDrropped.inc({reason: 'missing_decimals'});
            return null;
        }
        return{
            price: Math.round(Number(msg.price) * Math.pow(10, decimals)),
            decimals: Number(decimals),
            ts: msg.ts ?Number(msg.ts): Date.now(),
        };
    } catch (e) {
            metric.messageDrropped.inc({reason: 'parse_error'});
            return null;
    }
}

export async function startPublisher(): Promise<void> {
    const streaKey = config.pubSub.stream;
    
    console.log(`[Engine] Subscibing to stream '{streamKey}'...`);
    
    while(true) {
        const response = await redis.xreadgroup('GROUP','engine-group','engine-consumer','BLOCK','STREAMS',streaKey,'>');
        if (response) {
            const message = response[0][1];
            for (const [id, fields] of message) {
                const normalisePrice = parseAndValidate(fields);
                if (normalisePrice) {
                    colesac(fields[1], normalisePrice);
                }
                redis.xack(streaKey, 'engine-group', id);
            }
        }
    }

}
