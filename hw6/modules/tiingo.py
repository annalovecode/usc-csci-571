from datetime import datetime
import pytz
from dateutil.relativedelta import relativedelta

from modules.request import Request
from modules.secrets import TIINGO_API_TOKEN


class Tiingo:
    BASE_URL = 'https://api.tiingo.com'
    TOKEN = TIINGO_API_TOKEN

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
        los_angeles_date = datetime.now(pytz.timezone('America/Los_Angeles')).date()
        return Tiingo.get(url, {
            'startDate': (los_angeles_date - relativedelta(months=6)).strftime("%Y-%m-%d"),
            'resampleFreq': '12hour',
            'columns': ','.join(['open', 'high', 'low', 'close', 'volume'])
        })

    @staticmethod
    def get_current_top_of_book_and_last_price(ticker):
        url = Tiingo._build_url(f"iex/{ticker}")
        return Tiingo.get(url)
