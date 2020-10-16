import express, { Request } from 'express';
import { Response, Parser } from './common';
import * as Service from './service';

const api = express.Router();

api.get('/search', async (req: Request, res) => {
    try {
        const query = Parser.parseParameter(req.query.query);
        const data = await Service.search(query);
        return Response.sendOk(res, data);
    } catch (error) {
        return Response.sendError(res, error);
    }
});

api.get('/details/:ticker', async (req: Request, res) => {
    try {
        const ticker = Parser.parseParameter(req.params.ticker);
        const data = await Service.getDetails(ticker);
        return Response.sendOk(res, data);
    } catch (error) {
        return Response.sendError(res, error);
    }
});

api.get('/summary/:ticker', async (req: Request, res) => {
    try {
        const ticker = Parser.parseParameter(req.params.ticker);
        const data = await Service.getSummary(ticker);
        return Response.sendOk(res, data);
    } catch (error) {
        return Response.sendError(res, error);
    }
});

api.get('/news/:ticker', async (req: Request, res) => {
    try {
        const ticker = Parser.parseParameter(req.params.ticker);
        const data = await Service.getNews(ticker);
        return Response.sendOk(res, data);
    } catch (error) {
        return Response.sendError(res, error);
    }
});

api.get('/charts/:ticker', async (req: Request, res) => {
    try {
        const ticker = Parser.parseParameter(req.params.ticker);
        const summary = req.query.summary;
        const data = await Service.getChartData(ticker, summary && summary === 'true');
        return Response.sendOk(res, data);
    } catch (error) {
        return Response.sendError(res, error);
    }
});

api.get('/last-price/:ticker', async (req: Request, res) => {
    try {
        const ticker = Parser.parseParameter(req.params.ticker);
        const data = await Service.getLastPrice(ticker);
        return Response.sendOk(res, data);
    } catch (error) {
        return Response.sendError(res, error);
    }
});

export default api;
