import moment from 'moment-timezone';
import { Parser, Tiingo, NewsAPI } from '../common';

interface SearchResultItem {
    readonly ticker: string;
    readonly name: string;
}

export const search = async (query: string): Promise<SearchResultItem[]> => {
    const items = await Tiingo.search(query);
    const searchResultItems: SearchResultItem[] = [];
    items.forEach(item => {
        try {
            searchResultItems.push({
                ticker: Parser.parseString(item.ticker),
                name: Parser.parseString(item.name)
            });
        } catch (error) {
            // Skip item
        }
    });
    return Parser.parseArray(searchResultItems);
};

interface Details {
    readonly ticker: string;
    readonly name: string;
    readonly exchangeCode: string;
    readonly lastPrice: number;
    readonly change: number;
    readonly changePercent: number;
    readonly currentTimestamp: string;
    readonly isMarketOpen: boolean;
    readonly lastTimestamp: string;
    readonly startDate: string;
    readonly description: string;
    readonly highPrice: number;
    readonly lowPrice: number;
    readonly openPrice: number;
    readonly prevClose: number;
    readonly volume: number;
    readonly midPrice?: number | string;
    readonly askPrice?: number;
    readonly askSize?: number;
    readonly bidPrice?: number;
    readonly bidSize?: number;
}

export const getDetails = async (ticker: string): Promise<Details> => {
    const [
        metadata,
        currentTopOfBookAndLastPrice
    ] = await Promise.all([
        Tiingo.getMetadata(ticker),
        Tiingo.getCurrentTopOfBookAndLastPrice(ticker)
    ]);

    ticker = Parser.parseString(metadata.ticker);
    const name = Parser.parseString(metadata.name);
    const exchangeCode = Parser.parseString(metadata.exchangeCode);

    const lastPrice = Parser.parseNumber(currentTopOfBookAndLastPrice.last);
    const prevClose = Parser.parseNumber(currentTopOfBookAndLastPrice.prevClose);
    const timestamp = Parser.parseString(currentTopOfBookAndLastPrice.timestamp);

    const change = Parser.parseNumber(lastPrice - prevClose);
    const changePercent = Parser.parseNumber((change * 100) / prevClose);

    const lastTimestampMoment = moment(timestamp).tz('America/Los_Angeles');
    const currentTimestampMoment = moment().tz('America/Los_Angeles');
    const isMarketOpen = currentTimestampMoment.diff(lastTimestampMoment, 'seconds') < 60;

    const lastTimestamp = lastTimestampMoment.format('YYYY-MM-DD HH:mm:ss');
    const currentTimestamp = currentTimestampMoment.format('YYYY-MM-DD HH:mm:ss');

    const startDate = Parser.parseString(metadata.startDate);
    const description = Parser.parseString(metadata.description);

    const highPrice = Parser.parseNumber(currentTopOfBookAndLastPrice.high);
    const lowPrice = Parser.parseNumber(currentTopOfBookAndLastPrice.low);
    const openPrice = Parser.parseNumber(currentTopOfBookAndLastPrice.open);
    const volume = Parser.parseNumber(currentTopOfBookAndLastPrice.volume);

    let details: Details = {
        ticker,
        name,
        exchangeCode,
        lastPrice,
        change,
        changePercent,
        currentTimestamp,
        isMarketOpen,
        lastTimestamp,
        startDate,
        description,
        highPrice,
        lowPrice,
        openPrice,
        prevClose,
        volume
    };

    if (isMarketOpen) {
        let midPrice: number | string;
        try {
            midPrice = Parser.parseNumber(currentTopOfBookAndLastPrice.mid);
        } catch (error) {
            midPrice = "-";
        }
        details = {
            ...details,
            midPrice,
            askPrice: Parser.parseNumber(currentTopOfBookAndLastPrice.askPrice),
            askSize: Parser.parseNumber(currentTopOfBookAndLastPrice.askSize),
            bidPrice: Parser.parseNumber(currentTopOfBookAndLastPrice.bidPrice),
            bidSize: Parser.parseNumber(currentTopOfBookAndLastPrice.bidSize)
        };
    }

    return details;
};

interface NewsItem {
    readonly publisher: string;
    readonly publishedDate: string;
    readonly title: string;
    readonly description: string;
    readonly url: string;
    readonly urlToImage: string;
}

export const getNews = async (ticker: string): Promise<NewsItem[]> => {
    const newsItems: NewsItem[] = [];
    let page = 1;
    while (page <= 5 && newsItems.length < 20) {
        const items = await NewsAPI.getEverything(ticker, page);
        for (const item of items) {
            try {
                newsItems.push({
                    publisher: Parser.parseString(item.source.name),
                    publishedDate: moment(Parser.parseString(item.publishedAt)).tz('America/Los_Angeles').format('LL'),
                    title: Parser.parseString(item.title),
                    description: Parser.parseString(item.description),
                    url: Parser.parseString(item.url),
                    urlToImage: Parser.parseString(item.urlToImage)
                });
            } catch (error) {
                // Skip item
            }
            if (newsItems.length === 20) {
                break;
            }
        }
        page += 1;
    }
    return Parser.parseArray(newsItems);
};

interface ChartItem {
    readonly date: number;
    readonly open: number;
    readonly high: number;
    readonly low: number;
    readonly close: number;
    readonly volume: number;
}

export const getChartData = async (ticker: string, summary = false): Promise<ChartItem[]> => {
    let items;
    if (summary) {
        items = await Tiingo.getLastDayPrices(ticker);
    } else {
        items = await Tiingo.getLastTwoYearPrices(ticker);
    }
    return items.map((item: any) => ({
        date: moment(Parser.parseString(item.date)).tz('America/Los_Angeles').valueOf(),
        open: Parser.parseNumber(item.open),
        high: Parser.parseNumber(item.high),
        low: Parser.parseNumber(item.low),
        close: Parser.parseNumber(item.close),
        volume: Parser.parseNumber(item.volume)
    }));
};

export const getLastPrice = async (ticker: string): Promise<number> => {
    const currentTopOfBookAndLastPrice = await Tiingo.getCurrentTopOfBookAndLastPrice(ticker);
    return Parser.parseNumber(currentTopOfBookAndLastPrice.last);
};
