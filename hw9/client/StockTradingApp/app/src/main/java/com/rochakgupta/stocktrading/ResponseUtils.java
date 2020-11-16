package com.rochakgupta.stocktrading;

import android.text.TextUtils;
import android.util.Log;

import com.android.volley.VolleyError;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class ResponseUtils {
    private static final String TAG = ResponseUtils.class.getSimpleName();

    private static final Gson gson = new GsonBuilder().setPrettyPrinting().serializeNulls().create();

    public static Map<String, Double> parseLastPrices(JSONObject data) {
        Type type = new TypeToken<Map<String, Double>>() {}.getType();
        return gson.fromJson(data.toString(), type);
    }

    public static List<SearchOption> parseSearchOptions(JSONArray data) {
        Type type = new TypeToken<List<SearchOption>>() {}.getType();
        return gson.fromJson(data.toString(), type);
    }

    public static void logJSONObject(JSONObject jsonObject) throws JSONException {
        Log.d(TAG, jsonObject.toString(4));
    }

    public static void logJSONArray(JSONArray jsonArray) throws JSONException {
        Log.d(TAG, jsonArray.toString(4));
    }

    public static void logError(VolleyError error) {
        String message = error.getMessage();
        if (!TextUtils.isEmpty(message)) {
            Log.w(TAG, Objects.requireNonNull(message));
        }
    }

    public static boolean isNotFoundError(VolleyError error) {
        return error.networkResponse != null && error.networkResponse.statusCode == 404;
    }
}
