package com.rochakgupta.stocktrading.main.section.portfolio;

import android.annotation.SuppressLint;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.common.Formatter;

public class PortfolioItem {

    private String ticker;

    private double price;

    private int stocks;

    private transient Double lastPrice;

    private PortfolioItem() {

    }

    public static PortfolioItem with(String ticker, int stocks, double price) {
        PortfolioItem item = new PortfolioItem();
        item.setTicker(ticker);
        item.setStocks(stocks);
        item.setPrice(price);
        return item;
    }

    private void setTicker(String ticker) {
        this.ticker = ticker;
    }

    private void setStocks(int stocks) {
        this.stocks = stocks;
    }

    private void setPrice(double price) {
        this.price = price;
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
        return String.format("%s shares", Formatter.getQuantityString(stocks));
    }

    public int getStocks() {
        return stocks;
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
            return R.color.black;
        }
        return getChange() < 0 ? R.color.red : R.color.green;
    }

    public Double getWorth() {
        if (!hasLastPrice()) {
            return null;
        }
        return stocks * lastPrice;
    }

    public void buy(int stocks, double price) {
        int totalStocks = this.stocks + stocks;
        double totalPrice = ((this.stocks * this.price) + (stocks * price)) / totalStocks;
        this.stocks = totalStocks;
        this.price = totalPrice;
    }

    public boolean sell(int stocks) {
        this.stocks -= stocks;
        return this.stocks == 0;
    }
}
