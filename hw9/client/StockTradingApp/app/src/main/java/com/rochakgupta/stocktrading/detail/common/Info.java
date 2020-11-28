package com.rochakgupta.stocktrading.detail.common;

import com.rochakgupta.stocktrading.R;

public class Info {
    private String ticker;

    private String name;

    private String description;

    private Double lastPrice;

    private Double change;

    private Double highPrice;

    private Double lowPrice;

    private Double openPrice;

    private Double volume;

    private Double midPrice;

    private Double bidPrice;

    public String getTicker() {
        return ticker;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Double getLastPrice() {
        return lastPrice;
    }

    public Double getChange() {
        return change;
    }

    public Double getHighPrice() {
        return highPrice;
    }

    public Double getLowPrice() {
        return lowPrice;
    }

    public Double getOpenPrice() {
        return openPrice;
    }

    public Double getVolume() {
        return volume;
    }

    public Double getMidPrice() {
        return midPrice;
    }

    public Double getBidPrice() {
        return bidPrice;
    }

    public int getChangeColor() {
        if (Math.abs(change) < 0.01) {
            return R.color.black;
        }
        return change < 0 ? R.color.red : R.color.green;
    }
}
