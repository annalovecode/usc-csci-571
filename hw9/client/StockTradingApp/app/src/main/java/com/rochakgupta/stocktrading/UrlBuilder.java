package com.rochakgupta.stocktrading;

import android.net.Uri;

public class UrlBuilder {
    private static final String SCHEME = "http";

    private static final String AUTHORITY = "usccsci571hw8-env.eba-2irm2bhk.us-east-1.elasticbeanstalk.com";

    private final Uri.Builder uriBuilder;

    public UrlBuilder() {
        uriBuilder = (new Uri.Builder()).scheme(SCHEME).authority(AUTHORITY);
    }

    public UrlBuilder path(String path) {
        uriBuilder.path(path);
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
