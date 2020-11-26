package com.rochakgupta.stocktrading;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.widget.NestedScrollView;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.common.Converter;
import com.rochakgupta.stocktrading.common.Logger;
import com.rochakgupta.stocktrading.common.Storage;
import com.rochakgupta.stocktrading.common.ToastManager;
import com.rochakgupta.stocktrading.common.api.Api;
import com.rochakgupta.stocktrading.common.api.ApiStatus;
import com.rochakgupta.stocktrading.main.favorites.FavoritesItem;
import com.rochakgupta.stocktrading.main.favorites.FavoritesSection;
import com.rochakgupta.stocktrading.main.portfolio.PortfolioItem;
import com.rochakgupta.stocktrading.main.portfolio.PortfolioSection;
import com.rochakgupta.stocktrading.main.search.SearchAdapter;
import com.rochakgupta.stocktrading.main.search.SearchOption;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

import io.github.luizgrp.sectionedrecyclerviewadapter.SectionedRecyclerViewAdapter;

public class MainActivity extends AppCompatActivity implements PortfolioSection.OnClickHandler,
        FavoritesSection.OnClickHandler {
    private static final String TAG = MainActivity.class.getSimpleName();

    private ConstraintLayout loadingLayout;
    private TextView errorView;
    private NestedScrollView successLayout;

    private ToastManager toastManager;

    private SearchAdapter searchAdapter;

    private PortfolioSection portfolioSection;
    private FavoritesSection favoritesSection;
    private SectionedRecyclerViewAdapter mSuccessViewAdapter;

    private Timer lastPricesFetchTimer;
    private static final int TIMER_DURATION_SECONDS = 15;

    private ApiStatus lastPricesFetchStatus;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.Theme_StockTradingApp);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initializeActionBar();

        loadingLayout = findViewById(R.id.main_cl_loading);
        errorView = findViewById(R.id.main_tv_error);
        successLayout = findViewById(R.id.main_nsv_success);

        toastManager = new ToastManager(this);

        Storage.initialize(this);

        Api.initialize(this);

        initializeRecyclerView();
    }

    private void initializeActionBar() {
        Toolbar toolbar = findViewById(R.id.main_toolbar);
        setSupportActionBar(toolbar);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayShowHomeEnabled(true);
        }
    }

    private void initializeRecyclerView() {
        mSuccessViewAdapter = new SectionedRecyclerViewAdapter();
        portfolioSection = new PortfolioSection(this, this);
        favoritesSection = new FavoritesSection(this, this);
        mSuccessViewAdapter.addSection(portfolioSection);
        mSuccessViewAdapter.addSection(favoritesSection);
        RecyclerView mSuccessView = findViewById(R.id.main_rv_success);
        mSuccessView.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.VERTICAL));
        mSuccessView.setLayoutManager(new LinearLayoutManager(this));
        mSuccessView.setAdapter(mSuccessViewAdapter);
    }

    @Override
    public void onPortfolioItemClick(PortfolioItem item) {
        String ticker = item.getTicker();
        startDetailActivity(ticker);
    }

    @Override
    public void onFavoritesItemClick(FavoritesItem item) {
        String ticker = item.getTicker();
        startDetailActivity(ticker);
    }

    private void startDetailActivity(String ticker) {
        Intent intent = new Intent(this, DetailActivity.class);
        intent.putExtra("ticker", ticker);
        startActivity(intent);
    }

    private void showLoadingLayout() {
        loadingLayout.setVisibility(View.VISIBLE);
        errorView.setVisibility(View.INVISIBLE);
        successLayout.setVisibility(View.INVISIBLE);
    }

    private void showErrorView() {
        loadingLayout.setVisibility(View.INVISIBLE);
        errorView.setVisibility(View.VISIBLE);
        successLayout.setVisibility(View.INVISIBLE);
    }

    private void startLastPricesFetchTimer() {
        Log.d(TAG, "Starting last prices fetch timer");
        lastPricesFetchTimer = new Timer();
        lastPricesFetchTimer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                Api.cancelLastPricesFetchRequest();
                List<String> tickers = getTickers();
                if (tickers.size() > 0) {
                    Api.makeLastPricesFetchRequest(tickers, response -> {
                        try {
                            JSONObject jsonData = response.getJSONObject("data");
                            Logger.logJSONObject(jsonData);
                            Map<String, Double> lastPrices = Converter.jsonToLastPrices(jsonData.toString());
                            onLastPricesFetchSuccess(lastPrices);
                        } catch (JSONException e) {
                            e.printStackTrace();
                            onLastPricesFetchError();
                        }
                    }, error -> {
                        Logger.logError(error);
                        onLastPricesFetchError();
                    });
                } else {
                    runOnUiThread(() -> onLastPricesFetchSuccess(Collections.emptyMap()));
                }
            }
        }, 0, TimeUnit.SECONDS.toMillis(TIMER_DURATION_SECONDS));
    }

    private List<String> getTickers() {
        Set<String> tickers = portfolioSection.getItems().stream().map(PortfolioItem::getTicker)
                                              .collect(Collectors.toSet());
        tickers.addAll(favoritesSection.getItems().stream().map(FavoritesItem::getTicker).collect(Collectors.toSet()));
        return new ArrayList<>(tickers);
    }

    private void onLastPricesFetchSuccess(Map<String, Double> lastPrices) {
        Map<String, Integer> stocks = updatePortfolioSection(lastPrices);
        updateFavoritesSection(lastPrices, stocks);
        mSuccessViewAdapter.notifyDataSetChanged();
        showSuccessLayout();
        lastPricesFetchStatus.success();
    }

    private Map<String, Integer> updatePortfolioSection(Map<String, Double> lastPrices) {
        List<PortfolioItem> portfolioItems = portfolioSection.getItems();
        portfolioItems.forEach(item -> item.setLastPrice(lastPrices.get(item.getTicker())));
        return portfolioItems.stream().collect(Collectors.toMap(PortfolioItem::getTicker, PortfolioItem::getStocks));
    }

    private void updateFavoritesSection(Map<String, Double> lastPrices, Map<String, Integer> stocks) {
        List<FavoritesItem> favoritesItems = favoritesSection.getItems();
        favoritesItems.forEach(item -> {
            String ticker = item.getTicker();
            item.setLastPrice(lastPrices.get(ticker));
            item.setStocks(stocks.get(ticker));
        });
    }

    private void showSuccessLayout() {
        loadingLayout.setVisibility(View.INVISIBLE);
        errorView.setVisibility(View.INVISIBLE);
        successLayout.setVisibility(View.VISIBLE);
    }

    private void onLastPricesFetchError() {
        if (lastPricesFetchStatus.isLoading()) {
            // First load
            showErrorView();
            lastPricesFetchStatus.error();
        } else {
            toastManager.show("Error occurred while refetching data");
        }
    }

    private void stopLastPricesFetchTimer() {
        Log.d(TAG, "Stopping last prices fetch timer");
        lastPricesFetchTimer.cancel();
        Api.cancelLastPricesFetchRequest();
    }

    public void initializeSections() {
        portfolioSection.setItems(Storage.getPortfolio());
        favoritesSection.setItems(Storage.getFavorites());
        mSuccessViewAdapter.notifyDataSetChanged();
    }

    @Override
    protected void onResume() {
        initializeSections();
        lastPricesFetchStatus = new ApiStatus();
        lastPricesFetchStatus.loading();
        showLoadingLayout();
        startLastPricesFetchTimer();
        super.onResume();
    }

    @Override
    protected void onPause() {
        stopLastPricesFetchTimer();
        super.onPause();
    }

    @SuppressLint("RestrictedApi")
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);

        MenuItem searchMenu = menu.findItem(R.id.main_action_search);

        SearchView searchView = (SearchView) searchMenu.getActionView();

        final SearchView.SearchAutoComplete searchAutoComplete =
                searchView.findViewById(androidx.appcompat.R.id.search_src_text);

        searchAdapter = new SearchAdapter(this, android.R.layout.simple_dropdown_item_1line);

        searchAutoComplete.setAdapter(searchAdapter);
        searchAutoComplete.setThreshold(3);

        int TRIGGER_AUTO_COMPLETE = 7;
        // Set to true when user clicks on an item in autocomplete to prevent autocomplete from triggering API request
        AtomicBoolean itemClicked = new AtomicBoolean(false);

        Handler handler = new Handler(message -> {
            if (message.what == TRIGGER_AUTO_COMPLETE) {
                String query = searchAutoComplete.getText().toString();
                if (!TextUtils.isEmpty(query) && query.length() > 2) {
                    Api.makeSearchOptionsFetchRequest(query, response -> {
                        try {
                            JSONArray jsonData = response.getJSONArray("data");
                            Logger.logJSONArray(jsonData);
                            List<SearchOption> searchOptions = Converter.jsonToSearchOptions(jsonData.toString());
                            searchAdapter.setItemsAndNotify(SearchOption.getFormattedOptions(searchOptions));
                        } catch (JSONException e) {
                            e.printStackTrace();
                            onSearchOptionsRequestFailure(null);
                        }
                    }, error -> {
                        Logger.logError(error);
                        String errorMessage = null;
                        if (Api.isNotFoundError(error)) {
                            errorMessage = "No results";
                        }
                        onSearchOptionsRequestFailure(errorMessage);
                    });
                } else {
                    searchAdapter.clearItemsAndNotify();
                }
            }
            return false;
        });

        searchAutoComplete.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (itemClicked.get()) {
                    itemClicked.set(false);
                } else {
                    Api.cancelSearchOptionsFetchRequest();
                    handler.removeMessages(TRIGGER_AUTO_COMPLETE);
                    handler.sendEmptyMessageDelayed(TRIGGER_AUTO_COMPLETE, 300);
                }
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        searchAutoComplete.setOnItemClickListener((adapterView, view, itemIndex, id) -> {
            String formattedSearchOption = (String) adapterView.getItemAtPosition(itemIndex);
            itemClicked.set(true);
            searchAutoComplete.setText(formattedSearchOption);
            String ticker = SearchOption.extractTickerFromFormattedOption(formattedSearchOption);
            startDetailActivity(ticker);
        });

        return super.onCreateOptionsMenu(menu);
    }

    private void onSearchOptionsRequestFailure(String message) {
        searchAdapter.clearItemsAndNotify();
        if (message == null) {
            message = "Error occurred while fetching search results";
        }
        toastManager.show(message);
    }

    public void onFooterClick(View view) {
        Uri uri = Uri.parse("https://www.tiingo.com");
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        startActivity(intent);
    }
}