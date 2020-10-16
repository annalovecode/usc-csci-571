import moment from 'moment';
import * as Request from '../request';
import * as Parser from '../../parser';
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

export const getLastDayPrices = async (ticker: string): Promise<any[]> => {
    const url = buildURL(`iex/${ticker}/prices`);
    let startDate = moment().tz('America/Los_Angeles');
    if (startDate.isoWeekday() > 5) {
        startDate = startDate.subtract(startDate.isoWeekday() - 5, "days");
    }
    const data = await get(url, {
        'startDate': startDate.format('YYYY-MM-DD'),
        'resampleFreq': '4min',
        'columns': 'open,high,low,close,volume'
    });
    return Parser.parseArray(data);
};

export const getLastTwoYearPrices = async (ticker: string): Promise<any[]> => {
    const url = buildURL(`iex/${ticker}/prices`);
    return await get(url, {
        'startDate': moment().tz('America/Los_Angeles').subtract(2, 'years').format('YYYY-MM-DD'),
        'resampleFreq': '12hour',
        'columns': 'open,high,low,close,volume'
    });
};

export const getCurrentTopOfBookAndLastPrice = async (ticker: string) => {
    const url = buildURL(`iex/${ticker}`);
    let data = await get(url);
    data = Parser.parseArray(data);
    return data[0];
};

export const search = async (query: string): Promise<any[]> => {
    const url = buildURL(`tiingo/utilities/search/${query}`);
    const data = await get(url, {
        columns: 'ticker,name'
    });
    return Parser.parseArray(data);
};
