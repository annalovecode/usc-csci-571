export class ApiStatus {
    private states = {
        INITIAL: 'initial',
        LOADING: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
    };

    private state = this.states.INITIAL;

    errorMessage: string = null;

    isInitial(): boolean {
        return this.state === this.states.INITIAL;
    }

    isLoading(): boolean {
        return this.state === this.states.LOADING;
    }

    isSuccess(): boolean {
        return this.state === this.states.SUCCESS;
    }

    isError(): boolean {
        return this.state === this.states.ERROR;
    }

    isCompleted(): boolean {
        return this.state === this.states.SUCCESS || this.state === this.states.ERROR;
    }

    reset(): void {
        this.state = this.states.INITIAL;
        this.errorMessage = null;
    }

    loading(): void {
        this.state = this.states.LOADING;
        this.errorMessage = null;
    }

    success(): void {
        this.state = this.states.SUCCESS;
        this.errorMessage = null;
    }

    error(errorMessage): void {
        this.state = this.states.ERROR;
        this.errorMessage = errorMessage;
    }

    getError(): string {
        return this.errorMessage;
    }
}
