import json

import requests

from modules.response import Response


class Request:

    @staticmethod
    def get(url, params):
        response = requests.get(url, params, headers={
            'Content-Type': 'application/json'
        })
        print(response.url)
        if response.status_code == Response.NOT_FOUND:
            raise Response.NotFoundException
        return json.loads(response.text)

