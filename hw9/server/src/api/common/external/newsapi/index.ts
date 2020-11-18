import * as Request from '../request';
import * as Parser from '../../parser';
import { BaseURL, ApiKey } from './config';
import { NotFoundError } from '../../error';

const buildURL = (resource: string): string => `${BaseURL}/${resource}`;

const get = async (url: string, params: { [param: string]: any } = {}) => {
    params.apiKey = ApiKey;
    return await Request.get(url, params);
};

export const getEverything = async (q: string, page = 1): Promise<any[]> => {
    const url = buildURL('everything');
    let data: any[];
    try {
        const response = await get(url, {
            'q': q,
            'page': page
        });
        data = Parser.parseArray(response.articles);
    } catch (error) {
        if (error instanceof NotFoundError) {
            data = [];
        } else {
            throw error;
        }
    }
    return data;
};
