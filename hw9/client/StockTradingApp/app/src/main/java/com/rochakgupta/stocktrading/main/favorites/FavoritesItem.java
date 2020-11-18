package com.rochakgupta.stocktrading.main.favorites;

import android.annotation.SuppressLint;

import com.rochakgupta.stocktrading.R;

public class FavoritesItem {

    private final String ticker;

    private final String name;

    private final double price;

    private transient Integer stocks;

    private transient Double currentPrice;

    public FavoritesItem(String ticker, String name, double price) {
        this.ticker = ticker;
        this.name = name;
        this.price = price;
    }

    public String getTicker() {
        return ticker;
    }

    @SuppressLint("DefaultLocale")
    public String getDescription() {
        if (stocks != null && stocks > 0) {
            return String.format("%d.0 shares", stocks);
        }
        return name;
    }

    public void setStocks(int stocks) {
        this.stocks = stocks;
    }

    public void setCurrentPrice(double currentPrice) {
        this.currentPrice = currentPrice;
    }

    public Double getCurrentPrice() {
        return currentPrice;
    }

    public Double getChange() {
        return currentPrice - price;
    }

    public Boolean getShowTrending() {
        return getChange() != 0;
    }

    public Integer getTrendingDrawable() {
        Double change = getChange();
        if (change < 0) {
            return R.drawable.ic_baseline_trending_down_24;
        } else if (change > 0) {
            return R.drawable.ic_twotone_trending_up_24;
        }
        return null;
    }

    public Integer getChangeColor() {
        Double change = getChange();
        if (change < 0) {
            return R.color.red;
        } else if (change > 0) {
            return R.color.green;
        }
        return R.color.black;
    }
}
