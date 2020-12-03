package com.rochakgupta.stocktrading.common;

import java.text.DecimalFormat;

public class Formatter {

    private static final DecimalFormat priceFormatter = new DecimalFormat("#0.00;-#0.00");

    private static final DecimalFormat priceWithSymbolFormatter = new DecimalFormat("'$'#0.00;-'$'#0.00");

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

    public static String getQuantityString(Integer value, int decimals) {
        if (value == null) {
            value = 0;
        }
        DecimalFormat quantityFormatter = getQuantityFormatter(decimals);
        return quantityFormatter.format(value);
    }

    private static DecimalFormat getQuantityFormatter(int decimals) {
        StringBuilder format = new StringBuilder("#,##0");
        if (decimals > 0) {
            format.append(".");
            while (decimals > 0) {
                format.append("0");
                decimals--;
            }
        }
        return new DecimalFormat(format.toString());
    }
}
