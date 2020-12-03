package com.rochakgupta.stocktrading.main.section.favorites;

import android.annotation.SuppressLint;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.common.Formatter;

public class FavoritesItem {

    private String ticker;

    private String name;

    private double price;

    private transient Integer stocks;

    private transient Double lastPrice;

    private FavoritesItem() {

    }

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

    public void setStocks(Integer stocks) {
        this.stocks = stocks;
    }

    public void setLastPrice(double lastPrice) {
        this.lastPrice = lastPrice;
    }

    public boolean hasLastPrice() {
        return this.lastPrice != null;
    }

    public String getTicker() {
        return ticker;
    }

    @SuppressLint("DefaultLocale")
    public String getDescription() {
        if (stocks != null && stocks > 0) {
            String sharesString = stocks < 2 ? "share" : "shares";
            return String.format("%s %s", Formatter.getQuantityString(stocks, 1), sharesString);
        }
        return name;
    }

    public Double getLastPrice() {
        return lastPrice;
    }

    public Double getChange() {
        if (!hasLastPrice()) {
            return null;
        }
        return lastPrice - price;
    }

    public Double getAbsoluteChange() {
        if (!hasLastPrice()) {
            return null;
        }
        return Math.abs(lastPrice - price);
    }

    public Boolean hasPriceChanged() {
        if (!hasLastPrice()) {
            return false;
        }
        return Math.abs(lastPrice - price) >= 0.01;
    }

    public Integer getTrendingDrawable() {
        if (!hasPriceChanged()) {
            return null;
        }
        return getChange() < 0 ? R.drawable.ic_baseline_trending_down_24 : R.drawable.ic_twotone_trending_up_24;
    }

    public int getChangeColor() {
        if (!hasPriceChanged()) {
            return R.color.grayDark;
        }
        return getChange() < 0 ? R.color.red : R.color.green;
    }
}
