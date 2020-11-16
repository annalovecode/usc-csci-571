package com.rochakgupta.stocktrading;

import android.content.Context;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;

import java.util.List;

public class RequestUtils {
    private static final String TAG = RequestUtils.class.getName();

    private static boolean sInitialized;
    private static RequestQueue mRequestQueue;

    public static final String LAST_PRICES_FETCH_REQUEST_TAG = "LAST_PRICES_FETCH_REQUEST_TAG";
    public static final String SEARCH_OPTIONS_FETCH_REQUEST_TAG = "SEARCH_OPTIONS_FETCH_REQUEST_TAG";

    synchronized public static void initialize(Context context) {
        if (!sInitialized) {
            sInitialized = true;
            mRequestQueue = Volley.newRequestQueue(context.getApplicationContext());
        }
    }

    public static void makeLastPricesFetchRequest(List<String> tickers, Response.Listener<JSONObject> listener,
                                                  Response.ErrorListener errorListener) {
        Log.d(TAG, "Fetching last prices");
        String url = (new UrlBuilder())
                .path("api/last-price")
                .addQueryParameter("tickers", String.join(",", tickers))
                .build();
        JsonObjectRequest request = buildRequest(url, listener, errorListener, LAST_PRICES_FETCH_REQUEST_TAG);
        addRequestToQueue(request);
    }

    public static void makeSearchOptionsFetchRequest(String query, Response.Listener<JSONObject> listener,
                                                     Response.ErrorListener errorListener) {
        Log.d(TAG, "Fetching search options");
        String url = (new UrlBuilder())
                .path("api/search")
                .addQueryParameter("query", query)
                .build();
        JsonObjectRequest request = buildRequest(url, listener, errorListener, SEARCH_OPTIONS_FETCH_REQUEST_TAG);
        addRequestToQueue(request);
    }

    private static JsonObjectRequest buildRequest(String url, Response.Listener<JSONObject> listener,
                                                  Response.ErrorListener errorListener, String tag) {
        Log.d(TAG, url);
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null, listener, errorListener);
        request.setTag(tag);
        return request;
    }

    synchronized private static void addRequestToQueue(JsonObjectRequest request) {
        mRequestQueue.add(request);
    }

    synchronized public static void cancelRequests(String tag) {
        mRequestQueue.cancelAll(tag);
    }
}
