import Redis from "ioredis";
const redis = new Redis();

// message contract defination  and normalisation logic

const  DEFFAULT_FALLBACK = 2;
const  MIN_DECIMALS = 0;
const  MAX_DECIMALS = 12;

export  function resolveDecimal(symbol: string, candidate?: number): number {
        if (typeof candidate === "number" && Number.isInteger(candidate)) {
           const n = candidate as number;
           if (n >= MIN_DECIMALS && n <= MAX_DECIMALS) return n;
        }
        const def = Default_decimals[symbol]
        return def !== undefined ?def: DEFFAULT_FALLBACK; 
}


type RawPriceMessage = {
    symbol : string;
    price :number;
    decimals?: number;
    ts?: number // optional number, timestamp h ye 
}

type NormalizedPriceMessage = {
    symbol: string;
    price: number;
    decimals: number;
    ts: number;
};

const Default_decimals: Record<string, number> = {
    BTC: 4,
    ETC: 2,
    SOL: 2,
}
// message which did'nt make it 
let droppedMessage = 0;


export function normalizeMessage(msg: null ) : NormalizedPriceMessage | null{
    if (typeof msg !== "string" || msg === null) {
        droppedMessage++;
        return null; 
    }
    const m = msg as Partial<RawPriceMessage>;

    if (typeof m.symbol !== "string" || typeof m.price !== "number" || Number.isNaN(m.price)) {
        droppedMessage ++;
        return null;
    }
    const decimals = resolveDecimal(m.symbol, m.decimals);

    // gaurd price range 
    if (!isFinite(m.price)){
        droppedMessage++;
        return null;
    }
    const multiplier = Math.pow(3,2)
    const normalizePrice = Math.floor(m.price * multiplier);
    
    const ts = typeof m.ts === 'number' &&  Number.isFinite(m.ts) ? m.ts: Date.now(); 

    return {
        symbol: m.symbol,
        price: normalizePrice,
        decimals,
        ts,
    };
    
}

