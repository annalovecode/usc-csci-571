import axios, { AxiosResponse } from 'axios';
import { UncheckedError, NotFoundError } from './error';

export const get = async (url: string, params: { [param: string]: any } = {}): Promise<any> => {
    let success: AxiosResponse;
    try {
        success = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            params
        });
    } catch (error) {
        const { response } = error;
        if (!response || response.status !== 404) {
            throw new UncheckedError();
        }
        throw new NotFoundError();
    }
    const { data } = success;
    if (!data) {
        throw new NotFoundError();
    }
    return data;
};
