import moment from 'moment-timezone';
import { Parser, Tiingo, NewsAPI } from '../common';
import { SearchResultItem, Detail, Info, ChartItem, NewsItem, LastPrices } from './models';

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
    return Parser.parseNonEmptyArray(searchResultItems);
};

const getInfo = async (ticker: string): Promise<Info> => {
    const [
        metadata,
        currentTopOfBookAndLastPrice
    ] = await Promise.all([
        Tiingo.getMetadata(ticker),
        Tiingo.getCurrentTopOfBookAndLastPrice(ticker)
    ]);

    const lastPrice = Parser.parseNumber(currentTopOfBookAndLastPrice.last);
    const prevClose = Parser.parseNumber(currentTopOfBookAndLastPrice.prevClose);

    const change = Parser.parseNumber(lastPrice - prevClose);

    return {
        ticker: Parser.parseString(metadata.ticker),
        name: Parser.parseString(metadata.name),
        description: Parser.parseString(metadata.description),
        lastPrice,
        change,
        highPrice: Parser.parseOptionalNumber(currentTopOfBookAndLastPrice.high),
        lowPrice: Parser.parseOptionalNumber(currentTopOfBookAndLastPrice.low),
        openPrice: Parser.parseOptionalNumber(currentTopOfBookAndLastPrice.open),
        volume: Parser.parseOptionalNumber(currentTopOfBookAndLastPrice.volume),
        midPrice: Parser.parseOptionalNumber(currentTopOfBookAndLastPrice.mid),
        bidPrice: Parser.parseOptionalNumber(currentTopOfBookAndLastPrice.bidPrice)
    };
};

export const getHistoricalChartData = async (ticker: string): Promise<ChartItem[]> => {
    const items = await Tiingo.getLastTwoYearPrices(ticker);
    const parsedItems = items.map((item: any) => ({
        date: moment(Parser.parseString(item.date)).tz('America/Los_Angeles').valueOf(),
        open: Parser.parseNumber(item.open),
        high: Parser.parseNumber(item.high),
        low: Parser.parseNumber(item.low),
        close: Parser.parseNumber(item.close),
        volume: Parser.parseNumber(item.volume)
    }));
    return Parser.parseNonEmptyArray(parsedItems);
};

const getNews = async (ticker: string): Promise<NewsItem[]> => {
    const now = moment().tz('America/Los_Angeles');
    const newsItems: NewsItem[] = [];
    let page = 1;
    while (page <= 5 && newsItems.length < 20) {
        const items = await NewsAPI.getEverything(ticker, page);
        if (items.length === 0) {
            break;
        }
        for (const item of items) {
            try {
                const publishedAt = moment(Parser.parseString(item.publishedAt)).tz('America/Los_Angeles');
                newsItems.push({
                    publisher: Parser.parseString(item.source.name),
                    publishedAt: `${moment.duration(now.diff(publishedAt)).humanize()} ago`,
                    title: Parser.parseString(item.title),
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
    return newsItems;
};

export const getDetail = async (ticker: string): Promise<Detail> => {
    const [
        info,
        news
    ] = await Promise.all([
        getInfo(ticker),
        getNews(ticker)
    ]);

    return {
        info,
        news
    };
};

export const getLastPrices = async (tickers: string[]): Promise<LastPrices> => {
    const currentTopOfBookAndLastPrices = await Tiingo.getCurrentTopOfBookAndLastPrices(tickers);
    const lastPrices: LastPrices = {};
    currentTopOfBookAndLastPrices.forEach(currentTopOfBookAndLastPrice => {
        const ticker = Parser.parseString(currentTopOfBookAndLastPrice.ticker);
        const lastPrice = Parser.parseNumber(currentTopOfBookAndLastPrice.last);
        lastPrices[ticker] = lastPrice;
    });
    return lastPrices;
};
