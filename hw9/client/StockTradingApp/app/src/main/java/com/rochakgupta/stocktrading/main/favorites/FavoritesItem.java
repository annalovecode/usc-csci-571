package com.rochakgupta.stocktrading.main.favorites;

import android.annotation.SuppressLint;

import com.rochakgupta.stocktrading.R;

public class FavoritesItem {

    private String ticker;

    private String name;

    private double price;

    private transient Integer stocks;

    private transient Double currentPrice;

    public static FavoritesItem with(String ticker, String name, double price) {
        FavoritesItem item = new FavoritesItem();
        item.setTicker(ticker);
        item.setName(name);
        item.setPrice(price);
        return item;
    }

    private void setTicker(String ticker) {
        this.ticker = ticker;
    }

    private void setName(String name) {
        this.name = name;
    }

    private void setPrice(double price) {
        this.price = price;
    }

    public void setStocks(int stocks) {
        this.stocks = stocks;
    }

    public void setCurrentPrice(double currentPrice) {
        this.currentPrice = currentPrice;
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

    public double getCurrentPrice() {
        if (currentPrice == null) {
            return 0.0;
        }
        return currentPrice;
    }

    public double getChange() {
        return getCurrentPrice() - price;
    }

    public boolean getShowTrending() {
        return getChange() != 0;
    }

    public Integer getTrendingDrawable() {
        double change = getChange();
        if (change < 0) {
            return R.drawable.ic_baseline_trending_down_24;
        } else if (change > 0) {
            return R.drawable.ic_twotone_trending_up_24;
        }
        return null;
    }

    public int getChangeColor() {
        double change = getChange();
        if (change < 0) {
            return R.color.red;
        } else if (change > 0) {
            return R.color.green;
        }
        return R.color.black;
    }
}
