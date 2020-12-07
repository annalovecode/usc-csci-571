package com.rochakgupta.stocktrading.common.api;

import android.net.Uri;

public class ApiUrlBuilder {
    private static final String BASE_URL = "BASE_URL";

    private final Uri.Builder uriBuilder;

    public ApiUrlBuilder() {
        uriBuilder = Uri.parse(BASE_URL).buildUpon();
    }

    public ApiUrlBuilder path(String path) {
        uriBuilder.encodedPath(path);
        return this;
    }

    public ApiUrlBuilder addQueryParameter(String key, String value) {
        uriBuilder.appendQueryParameter(key, value);
        return this;
    }

    public String build() {
        return uriBuilder.build().toString();
    }
}
