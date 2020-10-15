import express, { NextFunction, Request, Response } from 'express';
import { NotFoundError } from './error';
import { StatusCode } from './response';
import * as tiingo from './tiingo';

const api = express.Router();

const errorHandler = (_req: Request, res: Response) => {
    const { error } = res.locals;
    if (error instanceof NotFoundError) {
        res.status(StatusCode.NOT_FOUND).json({
            error: 'No data'
        });
    }
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        error: 'Unknown error'
    });
};

const searchHandler = async (req: Request, res: Response, next: NextFunction) => {
    let data;
    try {
        data = await tiingo.search(req.params.query);
    } catch (error) {
        res.locals.error = error;
        next();
    }
    res.json({
        data
    });
};

api.get('/search/:query', searchHandler, errorHandler);

export default api;
