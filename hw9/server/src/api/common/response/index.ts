import { Response } from 'express';
import { BadRequestError, NetworkError, NotFoundError, UncheckedError } from '../error';

enum StatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 504
}

export const sendOk = (res: Response, data: any) => {
    res.status(StatusCode.OK).json({
        data
    });
};

export const sendError = (res: Response, error: Error) => {
    let statusCode: number;
    let message: string;
    if (error instanceof BadRequestError) {
        statusCode = StatusCode.BAD_REQUEST;
        message = 'Bad request';
    } else if (error instanceof NotFoundError) {
        statusCode = StatusCode.NOT_FOUND;
        message = 'Not found';
    } else if (error instanceof UncheckedError || error instanceof NetworkError) {
        statusCode = StatusCode.SERVICE_UNAVAILABLE;
        message = 'External API unavailable';
    } else {
        statusCode = StatusCode.INTERNAL_SERVER_ERROR;
        message = 'Internal server error';
    }
    res.status(statusCode).json({
        message
    });
};
