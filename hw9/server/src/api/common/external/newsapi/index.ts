import * as Request from '../request';
import * as Parser from '../../parser';
import { BaseURL, ApiKey } from './config';

const buildURL = (resource: string): string => `${BaseURL}/${resource}`;

const get = async (url: string, params: { [param: string]: any } = {}) => {
    params.apiKey = ApiKey;
    return await Request.get(url, params);
};

export const getEverything = async (q: string, page = 1): Promise<any[]> => {
    const url = buildURL('everything');
    const data = await get(url, {
        'q': q,
        'page': page
    });
    return Parser.parseArray(data.articles);
};
