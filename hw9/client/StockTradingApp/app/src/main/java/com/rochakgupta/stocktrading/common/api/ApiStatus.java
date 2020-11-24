package com.rochakgupta.stocktrading.common.api;

public class ApiStatus {
    private enum Status {
        INITIAL,
        LOADING,
        SUCCESS,
        ERROR
    }

    private Status status;

    public ApiStatus() {
        status = Status.INITIAL;
    }

    public void loading() {
        status = Status.LOADING;
    }

    public void success() {
        status = Status.SUCCESS;
    }

    public void error() {
        status = Status.ERROR;
    }

    public boolean isInitial() {
        return status == Status.INITIAL;
    }

    public boolean isLoading() {
        return status == Status.LOADING;
    }

    public boolean isSuccess() {
        return status == Status.SUCCESS;
    }

    public boolean isError() {
        return status == Status.ERROR;
    }

    public boolean isComplete() {
        return isSuccess() || isError();
    }
}
