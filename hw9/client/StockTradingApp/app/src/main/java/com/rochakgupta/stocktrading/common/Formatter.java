package com.rochakgupta.stocktrading.common;

import java.text.DecimalFormat;

public class Formatter {

    private static final DecimalFormat priceFormatter = new DecimalFormat("#0.00;-#0.00");

    private static final DecimalFormat priceWithSymbolFormatter = new DecimalFormat("'$'#0.00;-'$'#0.00");

    private static final DecimalFormat quantityFormatter = new DecimalFormat("#,##0.0");

    public static String getPriceString(Double value) {
        if (value == null) {
            value = 0.0;
        }
        return priceFormatter.format(value);
    }

    public static String getPriceStringWithSymbol(Double value) {
        if (value == null) {
            value = 0.0;
        }
        return priceWithSymbolFormatter.format(value);
    }

    public static String getQuantityString(Integer value) {
        if (value == null) {
            value = 0;
        }
        return quantityFormatter.format(value);
    }
}
