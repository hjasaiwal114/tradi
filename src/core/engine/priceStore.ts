import {config} from '../../config'; 
import { NormalisePrice } from '../../shared/types/price';
import { metric } from './metric';

// final stable price 

const PRICE: Map<string, NormalisePrice> = new Map();

// temporary buffer that get update each tym
const priceUpdateBuffer: Map<string, NormalisePrice> = new Map();

export function colesac(symbol: string, price:NormalisePrice): void {
    priceUpdateBuffer.set(symbol, price);
}

// the flush loop mechanism, this moves data from buffer to the main prices map

function flush(): void{
    const end = metric.flushDuration.startTimer();
    if (priceUpdateBuffer.size === 0) {
        end(); // observer duratino agar empty h to
        return;
    }
    for (const [symbol, priceValue] of priceUpdateBuffer.entries()) {
        PRICE.set(symbol, priceValue);
    }
    priceUpdateBuffer.clear();

    metric.flushTotal.inc();
    metric.symbolCounts.set(PRICE.size);
    end();
}

export function startFlushLoop(): void {
    setInterval(flush, config.flushIntervalMs);
    console.log(`[Engine] Flush loop started with ${config.flushIntervalMs}ms interval.`);
}

export function getPriceBySymbol(symbol: string): NormalisePrice | undefined {
    return PRICE.get(symbol);
}

export function getPrice(): Record<string, NormalisePrice> {
    return Object.fromEntries(PRICE);
}
export function getPriceBySymbol(symbol: string): NormalisePrice | undefined {
    return PRICE.get(symbol);
}
