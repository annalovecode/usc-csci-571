from flask import Flask, redirect, url_for, jsonify

from modules.response import Response
from modules.service import StockService

app = Flask(__name__,
            static_url_path='',
            static_folder='static',
            template_folder='templates')


@app.route('/')
def home():
    return redirect(url_for('static', filename='index.html'))


@app.route('/company-outlook/<string:stock_ticker_symbol>')
def get_company_outlook(stock_ticker_symbol):
    try:
        return Response.ok(StockService.get_company_outlook(stock_ticker_symbol))
    except Response.NotFoundException:
        return Response.not_found()


@app.route('/stock-summary/<string:stock_ticker_symbol>')
def get_stock_summary(stock_ticker_symbol):
    try:
        return Response.ok(StockService.get_stock_summary(stock_ticker_symbol))
    except Response.NotFoundException:
        return Response.not_found()


@app.route('/chart-data/<string:stock_ticker_symbol>')
def get_chart_data(stock_ticker_symbol):
    try:
        return Response.ok(jsonify(StockService.get_chart_data(stock_ticker_symbol)))
    except Response.NotFoundException:
        return Response.not_found()


@app.route('/latest-news/<string:stock_ticker_symbol>')
def get_latest_news(stock_ticker_symbol):
    try:
        return Response.ok(jsonify(StockService.get_latest_news(stock_ticker_symbol)))
    except Response.NotFoundException:
        return Response.not_found()


if __name__ == '__main__':
    # TODO: Remove debug mode
    app.run(debug=True)
