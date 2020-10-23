
enum ApiErrorType {
    CLIENT_OR_NETWORK,
    BACKEND
}

enum ApiErrorStatusCode {
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 504
}

export class ApiError extends Error {
    private type: ApiErrorType = null;
    private statusCode: ApiErrorStatusCode = null;

    static clientOrNetwork(message: string): ApiError {
        const error = new ApiError(message);
        error.type = ApiErrorType.CLIENT_OR_NETWORK;
        return error;
    }

    static backend(statusCode: ApiErrorStatusCode, message: string): ApiError {
        const error = new ApiError(message);
        error.statusCode = statusCode;
        error.type = ApiErrorType.BACKEND;
        return error;
    }

    static isStatusCode(statusCode): boolean {
        return statusCode in ApiErrorStatusCode;
    }

    private isType(type: ApiErrorType): boolean {
        return this.type === type;
    }

    isClientOrNetwork(): boolean {
        return this.isType(ApiErrorType.CLIENT_OR_NETWORK);
    }

    isBackend(): boolean {
        return this.isType(ApiErrorType.BACKEND);
    }

    private isBackendStatusCode(statusCode: number): boolean {
        return this.isBackend() && this.statusCode === statusCode;
    }

    isBadRequest(): boolean {
        return this.isBackendStatusCode(ApiErrorStatusCode.BAD_REQUEST);
    }

    isNotFound(): boolean {
        return this.isBackendStatusCode(ApiErrorStatusCode.NOT_FOUND);
    }

    isInternalServerError(): boolean {
        return this.isBackendStatusCode(ApiErrorStatusCode.INTERNAL_SERVER_ERROR);
    }

    isServiceUnavailable(): boolean {
        return this.isBackendStatusCode(ApiErrorStatusCode.SERVICE_UNAVAILABLE);
    }
}
