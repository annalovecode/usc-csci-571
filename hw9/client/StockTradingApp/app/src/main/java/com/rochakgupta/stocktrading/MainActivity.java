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
import android.widget.Toast;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.api.ApiStatus;
import com.rochakgupta.stocktrading.api.ApiUtils;
import com.rochakgupta.stocktrading.log.LoggingUtils;
import com.rochakgupta.stocktrading.gson.GsonUtils;
import com.rochakgupta.stocktrading.main.favorites.FavoritesItem;
import com.rochakgupta.stocktrading.main.favorites.FavoritesSection;
import com.rochakgupta.stocktrading.main.search.SearchAdapter;
import com.rochakgupta.stocktrading.main.search.SearchOption;
import com.rochakgupta.stocktrading.storage.StockPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

import io.github.luizgrp.sectionedrecyclerviewadapter.SectionAdapter;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionedRecyclerViewAdapter;

public class MainActivity extends AppCompatActivity implements FavoritesSection.OnClickListener {
    private final String TAG = MainActivity.class.getSimpleName();

    private ConstraintLayout loadingLayout;
    private TextView errorView;
    private ConstraintLayout successLayout;

    private SearchAdapter searchAdapter;

    private FavoritesSection favoritesSection;
    private SectionedRecyclerViewAdapter mSuccessViewAdapter;

    private Timer lastPricesFetchTimer;
    private ApiStatus lastPricesFetchStatus;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.Theme_StockTradingApp);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initializeActionBar();

        loadingLayout = findViewById(R.id.cl_loading);
        errorView = findViewById(R.id.tv_error);
        successLayout = findViewById(R.id.cl_success);

        initializeRecyclerView();

        StockPreferences.initialize(this);

        ApiUtils.initialize(this);

        lastPricesFetchStatus = new ApiStatus();

        showLoadingLayout();
    }

    private void initializeActionBar() {
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayShowHomeEnabled(true);
        }
    }

    private void initializeRecyclerView() {
        mSuccessViewAdapter = new SectionedRecyclerViewAdapter();
        favoritesSection = new FavoritesSection(this, this);
        mSuccessViewAdapter.addSection(favoritesSection);
        RecyclerView mSuccessView = findViewById(R.id.rv_success);
        mSuccessView.setLayoutManager(new LinearLayoutManager(this));
        mSuccessView.setAdapter(mSuccessViewAdapter);
    }

    @Override
    public void onFavoritesItemClicked(FavoritesItem item) {
        String ticker = item.getTicker();
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
                ApiUtils.makeLastPricesFetchRequest(Collections.singletonList("AAPL"), response -> {
                    try {
                        JSONObject jsonData = response.getJSONObject("data");
                        LoggingUtils.logJSONObject(jsonData);
                        Map<String, Double> lastPrices = GsonUtils.jsonToLastPrices(jsonData.toString());
                        onLastPricesFetchSuccess(lastPrices);
                    } catch (JSONException e) {
                        e.printStackTrace();
                        onLastPricesFetchError();
                    }
                }, error -> {
                    LoggingUtils.logError(error);
                    onLastPricesFetchError();
                });
            }
        }, 0, TimeUnit.SECONDS.toMillis(1000));
    }

    private void onLastPricesFetchSuccess(Map<String, Double> lastPrices) {
        List<FavoritesItem> favoritesItems = buildFavoritesItems(lastPrices);
        updateFavoritesSection(favoritesItems);
        showSuccessLayout();
        lastPricesFetchStatus.success();
    }

    private List<FavoritesItem> buildFavoritesItems(Map<String, Double> lastPrices) {
        List<FavoritesItem> items = StockPreferences.getFavorites();
        items.forEach(favoritesItem -> {
            favoritesItem.setCurrentPrice(lastPrices.get(favoritesItem.getTicker()));
        });
        return items;
    }

    private void updateFavoritesSection(List<FavoritesItem> items) {
        favoritesSection.setItems(items);
        SectionAdapter adapter = mSuccessViewAdapter.getAdapterForSection(favoritesSection);
        adapter.notifyAllItemsChanged();
    }

    private void showSuccessLayout() {
        loadingLayout.setVisibility(View.INVISIBLE);
        errorView.setVisibility(View.INVISIBLE);
        successLayout.setVisibility(View.VISIBLE);
    }

    private void onLastPricesFetchError() {
        if (!lastPricesFetchStatus.isComplete()) {
            // First load
            showErrorView();
            lastPricesFetchStatus.error();
        } else {
            Toast.makeText(
                    this, "Error occurred while refetching last prices", Toast.LENGTH_SHORT).show();
        }
    }

    private void stopLastPricesFetchTimer() {
        Log.d(TAG, "Stopping last prices fetch timer");
        lastPricesFetchTimer.cancel();
        ApiUtils.cancelRequests(ApiUtils.LAST_PRICES_FETCH_REQUEST_TAG);
    }

    @Override
    protected void onResume() {
        super.onResume();
        startLastPricesFetchTimer();
    }

    @Override
    protected void onPause() {
        super.onPause();
        stopLastPricesFetchTimer();
        cancelSearchOptionsFetchRequests();
    }

    @SuppressLint("RestrictedApi")
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);

        MenuItem searchMenu = menu.findItem(R.id.action_search);

        SearchView searchView = (SearchView) searchMenu.getActionView();

        final SearchView.SearchAutoComplete searchAutoComplete =
                searchView.findViewById(androidx.appcompat.R.id.search_src_text);

        searchAdapter = new SearchAdapter(
                this,
                android.R.layout.simple_dropdown_item_1line);

        searchAutoComplete.setAdapter(searchAdapter);
        searchAutoComplete.setThreshold(3);

        int TRIGGER_AUTO_COMPLETE = 7;
        // Set to true when user clicks on an item in autocomplete to prevent autocomplete from triggering API request
        AtomicBoolean itemClicked = new AtomicBoolean(false);

        Handler handler = new Handler(message -> {
            if (message.what == TRIGGER_AUTO_COMPLETE) {
                String query = searchAutoComplete.getText().toString();
                if (!TextUtils.isEmpty(query) && query.length() > 2) {
                    ApiUtils.makeSearchOptionsFetchRequest(query, response -> {
                        try {
                            JSONArray jsonData = response.getJSONArray("data");
                            LoggingUtils.logJSONArray(jsonData);
                            List<SearchOption> searchOptions = GsonUtils.jsonToSearchOptions(jsonData.toString());
                            searchAdapter.setItemsAndNotify(SearchOption.getFormattedOptions(searchOptions));
                        } catch (JSONException e) {
                            e.printStackTrace();
                            onSearchOptionsRequestFailure(null);
                        }
                    }, error -> {
                        LoggingUtils.logError(error);
                        String errorMessage = null;
                        if (ApiUtils.isNotFoundError(error)) {
                            errorMessage = "No search options found";
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
                    cancelSearchOptionsFetchRequests();
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
            Log.d(TAG, formattedSearchOption);
            // Launch detail activity
        });

        return super.onCreateOptionsMenu(menu);
    }

    private void onSearchOptionsRequestFailure(String message) {
        searchAdapter.clearItemsAndNotify();
        if (message == null) {
            message = "Error occurred while fetching search options";
        }
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    private void cancelSearchOptionsFetchRequests() {
        ApiUtils.cancelRequests(ApiUtils.SEARCH_OPTIONS_FETCH_REQUEST_TAG);
    }

    public void onFooterClick(View view) {
        Uri uri = Uri.parse("https://www.tiingo.com");
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        startActivity(intent);
    }
}