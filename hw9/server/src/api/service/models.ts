export interface SearchResultItem {
    ticker: string;
    name: string;
}

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
    midPrice?: number | string;
    askPrice?: number;
    askSize?: number;
    bidPrice?: number;
    bidSize?: number;
    chartData: ChartItem[];
}

export interface ChartItem {
    date: number;
    open?: number;
    high?: number;
    low?: number;
    close: number;
    volume?: number;
}

export interface DetailsAndSummary {
    details: Details;
    summary: Summary;
}

export interface NewsItem {
    publisher: string;
    publishedDate: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
}

export interface LastPrices {
    [ticker: string]: number;
}
