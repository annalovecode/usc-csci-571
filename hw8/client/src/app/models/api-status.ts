enum ApiStatusState {
    INITIAL,
    LOADING,
    SUCCESS,
    ERROR
}

export class ApiStatus {
    private state = ApiStatusState.INITIAL;

    errorMessage: string = null;

    private isState(state: ApiStatusState): boolean {
        return this.state === state;
    }

    isInitial(): boolean {
        return this.isState(ApiStatusState.INITIAL);
    }

    isLoading(): boolean {
        return this.isState(ApiStatusState.LOADING);
    }

    isSuccess(): boolean {
        return this.isState(ApiStatusState.SUCCESS);
    }

    isError(): boolean {
        return this.isState(ApiStatusState.ERROR);
    }

    isCompleted(): boolean {
        return this.isError() || this.isSuccess();
    }

    reset(): void {
        this.state = ApiStatusState.INITIAL;
        this.errorMessage = null;
    }

    loading(): void {
        this.state = ApiStatusState.LOADING;
        this.errorMessage = null;
    }

    success(): void {
        this.state = ApiStatusState.SUCCESS;
        this.errorMessage = null;
    }

    error(errorMessage: string): void {
        this.state = ApiStatusState.ERROR;
        this.errorMessage = errorMessage;
    }

    getError(): string {
        return this.errorMessage;
    }
}
