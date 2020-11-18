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

export const getLastTwoYearPrices = async (ticker: string): Promise<any[]> => {
    const url = buildURL(`tiingo/daily/${ticker}/prices`);
    let data: any[];
    try {
        data = await get(url, {
            'startDate': moment().tz('America/Los_Angeles').subtract(2, 'years').format('YYYY-MM-DD'),
            'resampleFreq': 'daily',
            'columns': 'open,high,low,close,volume'
        });
        data = Parser.parseArray(data);
    } catch (error) {
        if (error instanceof NotFoundError) {
            data = [];
        } else {
            throw error;
        }
    }
    return data;
};

export const getCurrentTopOfBookAndLastPrice = async (ticker: string) => {
    const url = buildURL(`iex/${ticker}`);
    let data = await get(url);
    data = Parser.parseNonEmptyArray(data);
    return data[0];
};

export const getCurrentTopOfBookAndLastPrices = async (tickers: string[]): Promise<any[]> => {
    const url = buildURL(`iex/`);
    let data = await get(url, {
        tickers: tickers.join(',')
    });
    data = Parser.parseNonEmptyArray(data);
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
    return Parser.parseNonEmptyArray(data);
};
