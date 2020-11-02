import { ChartItem } from './chart-item';

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
}

export interface Summary {
    startDate: string;
    description: string;
    highPrice: number;
    lowPrice: number;
    openPrice: number;
    prevClose: number;
    volume: number;
    midPrice?: number;
    askPrice?: number;
    askSize?: number;
    bidPrice?: number;
    bidSize?: number;
    chartData: ChartItem[];
}

export interface DetailsAndSummary {
    details: Details;
    summary: Summary;
}
