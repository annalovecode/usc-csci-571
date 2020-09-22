from datetime import datetime

from modules.newsapi import NewsAPI
from modules.response import Response
from modules.tiingo import Tiingo


class StockService:
    class ValueAbsentException(Exception):
        pass

    @staticmethod
    def get_company_outlook(stock_ticker_symbol):
        response = Tiingo.get_ticker_metadata(stock_ticker_symbol)
        return {
            'companyName': response['name'],
            'stockTickerSymbol': response['ticker'],
            'stockExchangeCode': response['exchangeCode'],
            'companyStartDate': response['startDate'],
            'description': response['description']
        }

    @staticmethod
    def get_stock_summary(stock_ticker_symbol):
        response = Tiingo.get_current_top_of_book_and_last_price(stock_ticker_symbol)
        if len(response) == 0:
            raise Response.NotFoundException
        response = response[0]

        def parse_value(value):
            if value is None:
                raise StockService.ValueAbsentException
            return value

        try:
            stock_summary = {
                'stockTickerSymbol': parse_value(response['ticker']),
                'tradingDay': str(parse_value(response['timestamp'])).split('T')[0],
                'previousClosingPrice': parse_value(response['prevClose']),
                'openingPrice': parse_value(response['open']),
                'highPrice': parse_value(response['high']),
                'lowPrice': parse_value(response['low']),
                'lastPrice': parse_value(response['last']),
                'change': round(parse_value(response['last']) - parse_value(response['prevClose']), 2),
                'changePercent': round(
                    ((parse_value(response['last']) - parse_value(response['prevClose'])) / parse_value(
                        response['prevClose'])) * 100, 2),
                'numberOfSharesTraded': parse_value(response['volume']),
            }
        except StockService.ValueAbsentException:
            raise Response.NotFoundException

        return stock_summary

    @staticmethod
    def get_chart_data(stock_ticker_symbol):
        response = Tiingo.get_historical_intraday_prices(stock_ticker_symbol)
        chart_data = []
        for price in response:
            chart_data.append({
                'date': price['date'],
                'stockPrice': price['close'],
                'volume': price['volume']
            })
        return chart_data

    @staticmethod
    def get_latest_news(stock_ticker_symbol):
        def parse_value(value):
            if type(value) != str or len(value) == 0:
                raise StockService.ValueAbsentException
            return value

        articles = []

        page = 1
        while True:
            response = NewsAPI.get_everything(stock_ticker_symbol, page)
            if len(response) == 0:
                break
            for article in response['articles']:
                try:
                    parsed_article = {
                        'image': parse_value(article['urlToImage']),
                        'title': parse_value(article['title']),
                        'linkToOriginalPost': parse_value(article['url'])
                    }
                    date_string = parse_value(article['publishedAt'])
                    date_string = date_string.replace("Z", "+00:00")
                    date_object = datetime.fromisoformat(date_string)
                    parsed_article['date'] = date_object.strftime('%m/%d/%Y')
                    articles.append(parsed_article)
                    if len(articles) == 5:
                        break
                except StockService.ValueAbsentException:
                    continue
            if len(articles) == 5:
                break
            # Free plan can retrieve a max of 100 articles (5 pages with 20 articles per page)
            if page == 5:
                break
            page += 1

        if len(articles) == 0:
            raise Response.NotFoundException

        return articles
