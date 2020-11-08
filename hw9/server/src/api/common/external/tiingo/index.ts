import moment from 'moment';
import * as Request from '../request';
import * as Parser from '../../parser';
import { NotFoundError } from '../../error';
import { BaseURL, Token } from './config';

const buildURL = (resource: string): string => `${BaseURL}/${resource}`;

const get = async (url: string, params: { [param: string]: any } = {}) => {
    params.token = Token;
    return await Request.get(url, params);
};

export const getMetadata = async (ticker: string) => {
    const url = buildURL(`tiingo/daily/${ticker}`);
    return await get(url);
};

export const getLastDayPrices = async (ticker: string, startDate: string): Promise<any[]> => {
    const url = buildURL(`iex/${ticker}/prices`);
    return await get(url, {
        'startDate': startDate,
        'resampleFreq': '4min',
        'columns': 'close'
    });
};

export const getLastTwoYearPrices = async (ticker: string): Promise<any[]> => {
    const url = buildURL(`tiingo/daily/${ticker}/prices`);
    const data = await get(url, {
        'startDate': moment().tz('America/Los_Angeles').subtract(2, 'years').format('YYYY-MM-DD'),
        'resampleFreq': 'daily',
        'columns': 'open,high,low,close,volume'
    });
    return Parser.parseArray(data);
};

export const getCurrentTopOfBookAndLastPrice = async (ticker: string) => {
    const url = buildURL(`iex/${ticker}`);
    let data = await get(url);
    data = Parser.parseArray(data);
    return data[0];
};

export const getCurrentTopOfBookAndLastPrices = async (tickers: string[]): Promise<any[]> => {
    const url = buildURL(`iex/`);
    let data = await get(url, {
        tickers: tickers.join(',')
    });
    data = Parser.parseArray(data);
    if (data.length < tickers.length) {
        throw new NotFoundError();
    }
    return data;
};

export const search = async (query: string): Promise<any[]> => {
    const url = buildURL(`tiingo/utilities/search/${query}`);
    const data = await get(url, {
        columns: 'ticker,name'
    });
    return Parser.parseArray(data);
};
