
export enum ApiErrorType {
    CLIENT_OR_NETWORK,
    BACKEND
}

export enum ApiErrorStatusCode {
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

    isClientOrNetwork(): boolean {
        return this.type === ApiErrorType.CLIENT_OR_NETWORK;
    }

    isBackend(): boolean {
        return this.type === ApiErrorType.BACKEND;
    }

    isNotFound(): boolean {
        return this.isBackend() && this.statusCode === ApiErrorStatusCode.NOT_FOUND;
    }

    isInternalServerError(): boolean {
        return this.isBackend() && this.statusCode === ApiErrorStatusCode.INTERNAL_SERVER_ERROR;
    }

    isServiceUnavailable(): boolean {
        return this.isBackend() && this.statusCode === ApiErrorStatusCode.SERVICE_UNAVAILABLE;
    }
}
