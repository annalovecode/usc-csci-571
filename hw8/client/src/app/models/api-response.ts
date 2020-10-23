import { ApiError } from './api-error';

enum ApiResponseType {
    SUCCESS,
    FAILURE
}

export class ApiResponse<T> {
    private type: ApiResponseType = null;
    data: T = null;
    error: ApiError = null;

    static success<T>(data: T): ApiResponse<T> {
        const response = new ApiResponse<T>();
        response.type = ApiResponseType.SUCCESS;
        response.data = data;
        return response;
    }

    static failure<T>(error: ApiError): ApiResponse<T> {
        const response = new ApiResponse<T>();
        response.type = ApiResponseType.FAILURE;
        response.error = error;
        return response;
    }

    isSuccess(): boolean {
        return this.type === ApiResponseType.SUCCESS;
    }

    isFailure(): boolean {
        return this.type === ApiResponseType.FAILURE;
    }
}
