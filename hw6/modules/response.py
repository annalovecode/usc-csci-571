class Response:
    class NotFoundException(Exception):
        pass

    OK = 200
    NOT_FOUND = 404

    @staticmethod
    def ok(data):
        return data, Response.OK

    @staticmethod
    def not_found():
        return 'Error : No record has been found, please enter a valid symbol', Response.NOT_FOUND
