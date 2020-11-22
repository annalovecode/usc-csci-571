import axios, { AxiosResponse, AxiosError } from 'axios';

export const Axios = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
});

Axios.interceptors.request.use((config) => {
    console.info(`API Request: ${axios.getUri(config)}`);
    return config;
}, (error: AxiosError) => {
    console.info(`API Request: ${error}`);
    return Promise.reject(error);
});

Axios.interceptors.response.use((response: AxiosResponse) => {
    // console.info(`API Response: ${JSON.stringify(response.data, undefined, 2)}`);
    return response;
}, (error: AxiosError) => {
    console.info(`API Response: ${error}`);
    return Promise.reject(error);
});
