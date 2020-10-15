import * as request from './request';

const config = {
    BASE_URL: 'https://api.tiingo.com',
    TOKEN: '79455133c32a6429cfac6c56469a919a11b5041e'
};

const buildUrl = (resource: string): string => `${config.BASE_URL}/${resource}`;

const get = async (url: string, params: { [param: string]: any } = {}) => {
    params.token = config.TOKEN;
    return await request.get(url, params);
};

export const getTickerMetadata = async (ticker: string) => {
    const url = buildUrl(`tiingo/daily/${ticker}`);
    return await get(url);
};

export const getEndOfDayPrices = async (ticker: string) => {
    const url = buildUrl(`tiingo/daily/${ticker}/prices`);
    return await get(url, {
        'startDate': "2012-08-08",
        'resampleFreq': '4min'
    });
};

export const getHistoricalIntradayPrices = async (ticker: string) => {
    const url = buildUrl(`iex/${ticker}/prices`);
    return await get(url, {
        'startDate': "2012-08-08",
        'resampleFreq': '4min',
        'columns': 'open,high,low,close,volume'
    });
};

export const getCurrentTopOfBookAndLastPrice = async (ticker: string) => {
    const url = buildUrl(`iex/${ticker}`);
    return await get(url);
};

export const search = async (query: string) => {
    const url = buildUrl(`tiingo/utilities/search/${query}`);
    return await get(url);
};
