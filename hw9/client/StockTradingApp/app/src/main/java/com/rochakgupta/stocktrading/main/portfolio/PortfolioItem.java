package com.rochakgupta.stocktrading.main.portfolio;

import android.annotation.SuppressLint;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.format.FormattingUtils;

public class PortfolioItem {

    private String ticker;

    private double price;

    private int stocks;

    private transient Double currentPrice;

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

    public void setCurrentPrice(double currentPrice) {
        this.currentPrice = currentPrice;
    }

    public boolean isCurrentPriceSet() {
        return this.currentPrice != null;
    }

    public String getTicker() {
        return ticker;
    }

    @SuppressLint("DefaultLocale")
    public String getDescription() {
        return String.format("%s shares", FormattingUtils.getQuantityString(stocks));
    }

    public int getStocks() {
        return stocks;
    }

    public Double getCurrentPrice() {
        return currentPrice;
    }

    public Double getChange() {
        if (!isCurrentPriceSet()) {
            return null;
        }
        return currentPrice - price;
    }

    public Boolean showTrending() {
        if (!isCurrentPriceSet()) {
            return null;
        }
        return getChange() != 0;
    }

    public Integer getTrendingDrawable() {
        if (!isCurrentPriceSet()) {
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
}
