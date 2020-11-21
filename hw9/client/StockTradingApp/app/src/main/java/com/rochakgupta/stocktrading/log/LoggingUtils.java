package com.rochakgupta.stocktrading.log;

import android.text.TextUtils;
import android.util.Log;

import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Objects;

public class LoggingUtils {
    private static final String TAG = LoggingUtils.class.getSimpleName();

    private static final boolean LOG_JSON = false;

    public static void logJSONObject(JSONObject jsonObject) throws JSONException {
        if (LOG_JSON) {
            Log.d(TAG, jsonObject.toString(4));
        }
    }

    public static void logJSONArray(JSONArray jsonArray) throws JSONException {
        if (LOG_JSON) {
            Log.d(TAG, jsonArray.toString(4));
        }
    }

    public static void logError(VolleyError error) {
        String message = error.getMessage();
        if (!TextUtils.isEmpty(message)) {
            Log.w(TAG, Objects.requireNonNull(message));
        }
    }
}
