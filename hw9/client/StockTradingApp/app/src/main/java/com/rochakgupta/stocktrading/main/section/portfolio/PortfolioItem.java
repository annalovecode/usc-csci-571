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

    public boolean isLastPriceSet() {
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
        if (!isLastPriceSet()) {
            return null;
        }
        return lastPrice - price;
    }

    public Boolean showTrending() {
        if (!isLastPriceSet()) {
            return null;
        }
        return getChange() != 0;
    }

    public Integer getTrendingDrawable() {
        if (!isLastPriceSet()) {
            return null;
        }
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

    public Double getTotalLastPrice() {
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
        return this.stocks != 0;
    }
}
