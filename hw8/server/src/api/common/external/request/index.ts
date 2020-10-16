import { AxiosResponse } from 'axios';
import { Axios } from './config';
import { UncheckedError, NotFoundError } from '../../error';

export const get = async (url: string, params: { [param: string]: any } = {}): Promise<any> => {
    let response: AxiosResponse;
    try {
        response = await Axios.get(url, {
            params
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new NotFoundError();
        }
        throw new UncheckedError();
    }
    if (!response.data) {
        throw new NotFoundError();
    }
    return response.data;
};
