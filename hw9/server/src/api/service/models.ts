export interface SearchResultItem {
    ticker: string;
    name: string;
}

export interface Details {
    ticker: string;
    name: string;
    lastPrice: number;
    change: number;
}

export interface Summary {
    description: string;
    highPrice: number;
    lowPrice: number;
    openPrice: number;
    prevClose: number;
    volume: number;
    midPrice: number;
    askPrice: number;
    askSize: number;
    bidPrice: number;
    bidSize: number;
}

export interface ChartItem {
    date: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface NewsItem {
    publisher: string;
    publishedAt: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
}

export interface Everything {
    details: Details;
    summary: Summary;
    news: NewsItem[];
    chart: ChartItem[];
}

export interface LastPrices {
    [ticker: string]: number;
}
