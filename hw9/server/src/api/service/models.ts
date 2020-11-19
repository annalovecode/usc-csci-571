export interface SearchResultItem {
    ticker: string;
    name: string;
}

export interface Info {
    ticker: string;
    name: string;
    description: string;
    lastPrice: number;
    change: number;
    highPrice: number;
    lowPrice: number;
    openPrice: number;
    volume: number;
    midPrice: number;
    bidPrice: number;
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
    info: Info;
    news: NewsItem[];
    chart: ChartItem[];
}

export interface LastPrices {
    [ticker: string]: number;
}
