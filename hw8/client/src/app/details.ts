export interface Details {
    ticker: string;
    name: string;
    exchangeCode: string;
    lastPrice: number;
    change: number;
    changePercent: number;
    currentTimestamp: string;
    isMarketOpen: boolean;
    lastTimestamp: string;
    startDate: string;
    description: string;
    highPrice: number;
    lowPrice: number;
    openPrice: number;
    prevClose: number;
    volume: number;
    midPrice?: number | string;
    askPrice?: number;
    askSize?: number;
    bidPrice?: number;
    bidSize?: number;
}
