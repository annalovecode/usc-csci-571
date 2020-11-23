package com.rochakgupta.stocktrading.common;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.rochakgupta.stocktrading.detail.Detail;
import com.rochakgupta.stocktrading.main.favorites.FavoritesItem;
import com.rochakgupta.stocktrading.main.portfolio.PortfolioItem;
import com.rochakgupta.stocktrading.main.search.SearchOption;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

public class Converter {
    private static final Gson gson = new GsonBuilder().setPrettyPrinting().serializeNulls().create();

    private static final Type favoritesItemsType = new TypeToken<List<FavoritesItem>>() {
    }.getType();

    private static final Type portfolioItemsType = new TypeToken<List<PortfolioItem>>() {
    }.getType();

    public static Map<String, Double> jsonToLastPrices(String json) {
        return gson.fromJson(json, new TypeToken<Map<String, Double>>() {
        }.getType());
    }

    public static List<SearchOption> jsonToSearchOptions(String json) {
        return gson.fromJson(json, new TypeToken<List<SearchOption>>() {
        }.getType());
    }

    public static double jsonToBalance(String json) {
        return gson.fromJson(json, Double.class);
    }

    public static String balanceToJson(double balance) {
        return gson.toJson(balance, Double.class);
    }

    public static List<FavoritesItem> jsonToFavorites(String json) {
        return gson.fromJson(json, favoritesItemsType);
    }

    public static String favoritesToJson(List<FavoritesItem> items) {
        return gson.toJson(items, favoritesItemsType);
    }

    public static List<PortfolioItem> jsonToPortfolio(String json) {
        return gson.fromJson(json, portfolioItemsType);
    }

    public static String portfolioToJson(List<PortfolioItem> items) {
        return gson.toJson(items, portfolioItemsType);
    }

    public static Detail jsonToDetail(String json) {
        return gson.fromJson(json, Detail.class);
    }
}
