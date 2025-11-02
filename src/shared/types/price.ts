export interface PriceMessage {
    symbol: string;
    price: number;
    decimals: number;
    ts?: number 
}

export interface NormalisePrice {
    price: number;
    decimals: number;
    ts: number; 
} 
