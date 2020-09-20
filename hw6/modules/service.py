from datetime import datetime

from modules.newsapi import NewsApi
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
        summary = {
            'stockTickerSymbol': response['ticker'],
            'previousClosingPrice': response['prevClose'],
            'openingPrice': response['open'],
            'highPrice': response['high'],
            'lowPrice': response['low'],
            'numberOfSharesTraded': response['volume'],
            'tradingDay': str(response['timestamp']).split('T')[0],
            'change': round(response['last'] - response['open'], 2)
        }
        summary['changePercent'] = round((summary['change'] / response['open']) * 100, 2)
        return summary

    @staticmethod
    def get_chart_data(stock_ticker_symbol):
        response = Tiingo.get_historical_intraday_prices(stock_ticker_symbol)
        parsed_prices = []
        for price in response:
            parsed_prices.append({
                'date': price['date'],
                'stockPrice': price['close'],
                'volume': price['volume']
            })
        return parsed_prices

    @staticmethod
    def _parse_value(value):
        if type(value) != str or len(value) == 0:
            raise StockService.ValueAbsentException
        return value

    @staticmethod
    def get_latest_news(stock_ticker_symbol):
        response = NewsApi.get_everything(stock_ticker_symbol)
        articles = []
        for article in response['articles']:
            try:
                parsed_article = {
                    'image': StockService._parse_value(article['urlToImage']),
                    'title': StockService._parse_value(article['title']),
                    'linkToOriginalPost': StockService._parse_value(article['url'])
                }
                date_string = StockService._parse_value(article['publishedAt'])
                date_string = date_string.replace("Z", "+00:00")
                date_object = datetime.fromisoformat(date_string)
                parsed_article['date'] = date_object.strftime('%m/%d/%Y')
                articles.append(parsed_article)
            except StockService.ValueAbsentException:
                continue
        return articles[:5]
