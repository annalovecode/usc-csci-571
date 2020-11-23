package com.rochakgupta.stocktrading.detail.stats;

import com.rochakgupta.stocktrading.common.Formatter;

public class Stat {
    private String name;

    private double value;

    private boolean isValueQuantity;

    private Stat() {

    }

    public static Stat ofPrice(String name, double value) {
        Stat stat = new Stat();
        stat.setName(name);
        stat.setValue(value);
        stat.setIsValueQuantity(false);
        return stat;
    }

    public static Stat ofQuantity(String name, double value) {
        Stat stat = new Stat();
        stat.setName(name);
        stat.setValue(value);
        stat.setIsValueQuantity(true);
        return stat;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public void setIsValueQuantity(boolean isValueQuantity) {
        this.isValueQuantity = isValueQuantity;
    }

    public String getName() {
        return name;
    }

    public Double getValue() {
        return value;
    }

    public String getFormattedStat() {
        String stringValue = "";
        if (isValueQuantity) {
            stringValue = Formatter.getQuantityString((int) value);
        } else {
            stringValue = Formatter.getPriceString(value);
        }
        return String.format("%s: %s", name, stringValue);
    }
}
