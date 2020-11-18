package com.rochakgupta.stocktrading.main.search;

import java.util.List;
import java.util.stream.Collectors;

public class SearchOption {
    private String ticker;

    private String name;

    public String getFormattedText() {
        return String.format("%s - %s", ticker, name);
    }

    public static List<String> getFormattedOptions(List<SearchOption> searchOptions) {
        return searchOptions.stream().map(SearchOption::getFormattedText).collect(Collectors.toList());
    }
}
