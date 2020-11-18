package com.rochakgupta.stocktrading.format;

import java.text.DecimalFormat;

public class FormattingUtils {

    private static final DecimalFormat doubleToStringFormatter = new DecimalFormat("#0.00;-#0.00");

    private static final DecimalFormat doubleToDollarStringFormatter = new DecimalFormat("'$'#0.00;-'$'#0.00");

    public static String doubleToString(Double value) {
        if (value == null) {
            value = 0.0;
        }
        return doubleToStringFormatter.format(value);
    }

    public static String doubleToDollarString(Double value) {
        if (value == null) {
            value = 0.0;
        }
        return doubleToDollarStringFormatter.format(value);
    }
}
