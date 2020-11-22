package com.rochakgupta.stocktrading.api;

import android.net.Uri;

public class UrlBuilder {
    private static final String SCHEME = "http";

    private static final String AUTHORITY = "usccsci571hw9-env.eba-6fuuwzjp.us-east-1.elasticbeanstalk.com";

    private final Uri.Builder uriBuilder;

    public UrlBuilder() {
        uriBuilder = (new Uri.Builder()).scheme(SCHEME).encodedAuthority(AUTHORITY);
    }

    public UrlBuilder path(String path) {
        uriBuilder.encodedPath(path);
        return this;
    }

    public UrlBuilder addQueryParameter(String key, String value) {
        uriBuilder.appendQueryParameter(key, value);
        return this;
    }

    public String build() {
        return uriBuilder.build().toString();
    }
}
