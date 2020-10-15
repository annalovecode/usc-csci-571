import * as request from './request';

const config = {
    BASE_URL: 'https://newsapi.org/v2',
    API_KEY: 'fdf56dd5e25046118f12c4626ceac170'
};

const buildUrl = (resource: string): string => `${config.BASE_URL}/${resource}`;

const get = async (url: string, params: { [param: string]: any } = {}) => {
    params.apiKey = config.API_KEY;
    return await request.get(url, params);
};

const getEverything = async (q: string, page = 1) => {
    const url = buildUrl('everything');
    return await get(url, {
        'q': q,
        'page': page
    });
};
