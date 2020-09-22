from modules.request import Request


class NewsAPI:
    BASE_URL = 'https://newsapi.org/v2'
    API_KEY = 'fdf56dd5e25046118f12c4626ceac170'

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
