from flask import Flask, redirect, url_for, jsonify, request

from modules.response import Response
from modules.service import StockService

app = Flask(__name__,
            static_url_path='',
            static_folder='static')


@app.route('/')
def home():
    return redirect(url_for('static', filename='index.html'))


@app.route('/company-outlook/<string:stock_ticker_symbol>')
def get_company_outlook(stock_ticker_symbol):
    print(request.url)
    try:
        data = StockService.get_company_outlook(stock_ticker_symbol)
        return Response.ok(data)
    except Response.NotFoundException:
        return Response.not_found()


@app.route('/stock-summary/<string:stock_ticker_symbol>')
def get_stock_summary(stock_ticker_symbol):
    print(request.url)
    try:
        data = StockService.get_stock_summary(stock_ticker_symbol)
        return Response.ok(data)
    except Response.NotFoundException:
        return Response.not_found()


@app.route('/charts/<string:stock_ticker_symbol>')
def get_chart_data(stock_ticker_symbol):
    print(request.url)
    try:
        data = StockService.get_chart_data(stock_ticker_symbol)
        return Response.ok(jsonify(data))
    except Response.NotFoundException:
        return Response.not_found('No data available')


@app.route('/latest-news/<string:stock_ticker_symbol>')
def get_latest_news(stock_ticker_symbol):
    print(request.url)
    try:
        data = StockService.get_latest_news(stock_ticker_symbol)
        return Response.ok(jsonify(data))
    except Response.NotFoundException:
        return Response.not_found('No news available')


# # TODO: Remove cors
# @app.after_request
# def after_request(response):
#     header = response.headers
#     header['Access-Control-Allow-Origin'] = '*'
#     return response


if __name__ == '__main__':
    # # TODO: Remove debug mode
    # app.run(debug=True)
    app.run()
