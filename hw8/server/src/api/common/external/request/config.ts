import axios, { AxiosResponse, AxiosError } from 'axios';

export const Axios = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
});

Axios.interceptors.request.use((config) => {
    console.log(`External API Request: ${axios.getUri(config)}`);
    return config;
}, (error: AxiosError) => {
    console.log(`External API Request: ${error}`);
    return Promise.reject(error);
});

Axios.interceptors.response.use((response: AxiosResponse) => {
    console.log(`External API Response: ${JSON.stringify(response.data, undefined, 2)}`);
    return response;
}, (error: AxiosError) => {
    console.log(`External API Response: ${error}`);
    return Promise.reject(error);
});
