package com.rochakgupta.stocktrading.api;

import android.net.Uri;

public class ApiUrlBuilder {
    private static final String SCHEME = "http";

    private static final String AUTHORITY = "usccsci571hw9-env.eba-6fuuwzjp.us-east-1.elasticbeanstalk.com";

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
