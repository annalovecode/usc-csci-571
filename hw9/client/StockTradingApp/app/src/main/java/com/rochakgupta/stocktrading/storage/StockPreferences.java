package com.rochakgupta.stocktrading.storage;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;

import com.rochakgupta.stocktrading.gson.GsonUtils;
import com.rochakgupta.stocktrading.main.favorites.FavoritesItem;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class StockPreferences {
    private static boolean initialized;

    private static Context context;

    private static final String PREFERENCES_FILE_NAME = "com.rochakgupta.stocktrading.PREFERENCES_FILE_NAME";
    private static final String FAVORITES_KEY = "com.rochakgupta.stocktrading.FAVORITES_KEY";

    synchronized public static void initialize(Context _context) {
        if (!initialized) {
            initialized = true;
            context = _context.getApplicationContext();
        }
    }


    synchronized public static List<FavoritesItem> getFavorites() {
        SharedPreferences preferences = getSharedPreferences();
        if (preferences.contains(FAVORITES_KEY)) {
            return GsonUtils.jsonToFavorites(preferences.getString(FAVORITES_KEY, null));
        }
        return Collections.singletonList(new FavoritesItem("AAPL", "Apple", 32.1));
    }

    synchronized public static boolean isFavorite(String ticker) {
        List<FavoritesItem> items = getFavorites();
        return items.stream().anyMatch(favoritesItem -> favoritesItem.getTicker().equals(ticker));
    }

    synchronized public static void addToFavorite(FavoritesItem item) {
        List<FavoritesItem> items = getFavorites();
        items.add(item);
        items.sort((f, s) -> f.getTicker().compareTo(s.getTicker()));
        updateFavorites(items);
    }

    synchronized public static void removeFromFavorites(String ticker) {
        List<FavoritesItem> items = getFavorites()
                .stream()
                .filter(item -> !item.getTicker().equals(ticker))
                .collect(Collectors.toList());
        updateFavorites(items);
    }

    private static void updateFavorites(List<FavoritesItem> items) {
        String json = GsonUtils.favoritesToJson(items);
        updatePreference(FAVORITES_KEY, json);
    }

    @SuppressLint("ApplySharedPref")
    private static void updatePreference(String key, String json) {
        SharedPreferences preferences = getSharedPreferences();
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(key, json);
        editor.commit();
    }

    private static SharedPreferences getSharedPreferences() {
        return context.getSharedPreferences(PREFERENCES_FILE_NAME, Context.MODE_PRIVATE);
    }
}
