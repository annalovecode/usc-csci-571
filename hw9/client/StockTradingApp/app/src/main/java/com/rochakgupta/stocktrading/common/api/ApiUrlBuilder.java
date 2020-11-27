package com.rochakgupta.stocktrading.common.api;

import android.net.Uri;

public class ApiUrlBuilder {
    private static final String SCHEME = "https";

    private static final String AUTHORITY = "usc-csci-571-hw9-r78bq3sp.wl.r.appspot.com";

    private final Uri.Builder uriBuilder;

    public ApiUrlBuilder() {
        uriBuilder = (new Uri.Builder()).scheme(SCHEME).encodedAuthority(AUTHORITY);
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
