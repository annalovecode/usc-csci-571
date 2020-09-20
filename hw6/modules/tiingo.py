from datetime import date

from dateutil.relativedelta import relativedelta

from modules.request import Request


class Tiingo:
    BASE_URL = 'https://api.tiingo.com/'
    TOKEN = '79455133c32a6429cfac6c56469a919a11b5041e'

    @staticmethod
    def _build_url(resource):
        return f"{Tiingo.BASE_URL}/{resource}"

    @staticmethod
    def get(url, params=None):
        if params is None:
            params = {}
        params['token'] = Tiingo.TOKEN
        return Request.get(url, params)

    @staticmethod
    def get_ticker_metadata(ticker):
        url = Tiingo._build_url(f"tiingo/daily/{ticker}")
        return Tiingo.get(url)

    @classmethod
    def get_historical_intraday_prices(cls, ticker):
        url = Tiingo._build_url(f"iex/{ticker}/prices")
        return Tiingo.get(url, {
            'startDate': (date.today() - relativedelta(months=6)).strftime("%Y-%m-%d"),
            'resampleFreq': '12hour',
            'columns': 'open,high,low,close,volume'
        })

    @staticmethod
    def get_current_top_of_book_and_last_price(ticker):
        url = Tiingo._build_url(f"iex/{ticker}")
        return Tiingo.get(url)
