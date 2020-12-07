from modules.request import Request
from modules.secrets import NEWSAPI_API_KEY


class NewsAPI:
    BASE_URL = 'https://newsapi.org/v2'
    API_KEY = NEWSAPI_API_KEY

    @staticmethod
    def _build_url(resource):
        return f"{NewsAPI.BASE_URL}/{resource}"

    @staticmethod
    def get(url, params=None):
        if params is None:
            params = {}
        params['apiKey'] = NewsAPI.API_KEY
        return Request.get(url, params)

    @staticmethod
    def get_everything(q, page=1):
        url = NewsAPI._build_url('everything')
        return NewsAPI.get(url, {
            'q': q,
            'page': page
        })
