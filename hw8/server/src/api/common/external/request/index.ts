import { AxiosResponse } from 'axios';
import { Axios } from './config';
import { UncheckedError, NotFoundError } from '../../error';
import NetworkError from '../../error/network';

export const get = async (url: string, params: { [param: string]: any } = {}): Promise<any> => {
    let response: AxiosResponse;
    try {
        response = await Axios.get(url, {
            params
        });
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            if (status === 404) {
                throw new NotFoundError();
            } else {
                throw new UncheckedError(status);
            }
        } else {
            throw new NetworkError();
        }
    }
    if (!response.data) {
        throw new NotFoundError();
    }
    return response.data;
};
