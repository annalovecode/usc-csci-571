package com.rochakgupta.stocktrading;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.GridView;
import android.widget.TextView;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.widget.NestedScrollView;

import com.rochakgupta.stocktrading.common.api.Api;
import com.rochakgupta.stocktrading.common.api.ApiStatus;
import com.rochakgupta.stocktrading.detail.common.Detail;
import com.rochakgupta.stocktrading.detail.common.Info;
import com.rochakgupta.stocktrading.detail.common.NewsItem;
import com.rochakgupta.stocktrading.detail.about.AboutManager;
import com.rochakgupta.stocktrading.detail.news.NewsManager;
import com.rochakgupta.stocktrading.detail.portfolio.PortfolioManager;
import com.rochakgupta.stocktrading.detail.stats.Stat;
import com.rochakgupta.stocktrading.detail.stats.StatsAdapter;
import com.rochakgupta.stocktrading.common.Formatter;
import com.rochakgupta.stocktrading.common.Converter;
import com.rochakgupta.stocktrading.common.Logger;
import com.rochakgupta.stocktrading.main.section.favorites.FavoritesItem;
import com.rochakgupta.stocktrading.common.Storage;
import com.rochakgupta.stocktrading.common.ToastManager;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.List;

public class DetailActivity extends AppCompatActivity {
    private static final String TAG = DetailActivity.class.getSimpleName();

    private String ticker;

    private ConstraintLayout loadingLayout;
    private TextView errorView;
    private NestedScrollView successView;

    private ToastManager toastManager;

    private ApiStatus detailFetchStatus;

    private Info info;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.Theme_StockTradingApp);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detail);

        initializeActionBar();

        Intent intent = getIntent();
        if (!intent.hasExtra("ticker")) {
            throw new RuntimeException("DetailActivity needs ticker data in intent to run");
        }

        ticker = intent.getStringExtra("ticker");

        loadingLayout = findViewById(R.id.detail_cl_loading);
        errorView = findViewById(R.id.detail_tv_error);
        successView = findViewById(R.id.detail_nsv_success);

        toastManager = new ToastManager(this);

        Storage.initialize(this);

        Api.initialize(this);

        initializeChartView();

        detailFetchStatus = new ApiStatus();
        detailFetchStatus.loading();

        showLoadingLayout();

        startDetailFetch();
    }

    private void initializeActionBar() {
        Toolbar toolbar = findViewById(R.id.detail_toolbar);
        setSupportActionBar(toolbar);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
        }
    }

    private void showLoadingLayout() {
        loadingLayout.setVisibility(View.VISIBLE);
        errorView.setVisibility(View.INVISIBLE);
        successView.setVisibility(View.INVISIBLE);
    }

    private void showErrorView() {
        loadingLayout.setVisibility(View.INVISIBLE);
        errorView.setVisibility(View.VISIBLE);
        successView.setVisibility(View.INVISIBLE);
    }

    private void startDetailFetch() {
        Api.makeDetailFetchRequest(ticker, response -> {
            try {
                JSONObject jsonData = response.getJSONObject("data");
                Logger.logJSONObject(jsonData);
                Detail detail = Converter.jsonToDetail(jsonData.toString());
                onDetailFetchSuccess(detail);
            } catch (JSONException e) {
                e.printStackTrace();
                onDetailFetchError();
            }
        }, error -> {
            Logger.logError(error);
            onDetailFetchError();
        });
    }

    private void onDetailFetchSuccess(Detail detail) {
        info = detail.getInfo();
        initializeInfoView();
        initializePortfolioView();
        initializeStatsGrid();
        initializeAboutView();
        initializeNewsView(detail.getNews());
        showSuccessLayout();
        detailFetchStatus.success();
    }

    private void initializeInfoView() {
        TextView tickerView = findViewById(R.id.detail_tv_info_ticker);
        tickerView.setText(ticker);
        TextView nameView = findViewById(R.id.detail_tv_info_name);
        nameView.setText(info.getName());
        TextView lastPriceView = findViewById(R.id.detail_tv_info_last_price);
        lastPriceView.setText(Formatter.getPriceStringWithSymbol(info.getLastPrice()));
        TextView changeView = findViewById(R.id.detail_tv_info_change);
        changeView.setText(Formatter.getPriceStringWithSymbol(info.getChange()));
        changeView.setTextColor(getColor(info.getChangeColor()));
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void initializeChartView() {
        WebView chartView = findViewById(R.id.detail_wv_chart);
        WebSettings settings = chartView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        chartView.loadUrl("file:///android_asset/chart.html?ticker=" + ticker);
    }

    private void initializePortfolioView() {
        PortfolioManager portfolioManager = new PortfolioManager(this, toastManager, info);
        portfolioManager.display();
    }

    private void initializeStatsGrid() {
        List<Stat> stats = Arrays.asList(
                Stat.ofPrice("Current Price", info.getLastPrice()),
                Stat.ofPrice("Low", info.getLowPrice()),
                Stat.ofPrice("Bid Price", info.getBidPrice()),
                Stat.ofPrice("Open Price", info.getOpenPrice()),
                Stat.ofPrice("Mid", info.getMidPrice()),
                Stat.ofPrice("High", info.getHighPrice()),
                Stat.ofQuantity("Volume", info.getVolume()));
        StatsAdapter adapter = new StatsAdapter(this, stats);
        GridView statsView = findViewById(R.id.detail_gv_stats);
        statsView.setAdapter(adapter);
    }

    private void initializeAboutView() {
        AboutManager aboutManager = new AboutManager(this, info.getDescription());
        aboutManager.display();
    }

    private void initializeNewsView(List<NewsItem> news) {
        new NewsManager(this, this, news);
    }

    private void onDetailFetchError() {
        showErrorView();
        detailFetchStatus.error();
    }

    private void showSuccessLayout() {
        loadingLayout.setVisibility(View.INVISIBLE);
        errorView.setVisibility(View.INVISIBLE);
        successView.setVisibility(View.VISIBLE);
    }

    @Override
    protected void onDestroy() {
        Api.cancelDetailFetchRequest();
        super.onDestroy();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.detail, menu);
        MenuItem item = menu.findItem(R.id.detail_action_favorite);
        int icon = getFavoriteIcon(Storage.isFavorite(ticker));
        item.setIcon(icon);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int itemId = item.getItemId();
        if (itemId == android.R.id.home) {
            onBackPressed();
            return true;
        } else if (itemId == R.id.detail_action_favorite) {
            onFavoriteClicked(item);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void onFavoriteClicked(MenuItem item) {
        if (detailFetchStatus.isLoading()) {
            toastManager.show("Still fetching data");
        } else if (detailFetchStatus.isError()) {
            toastManager.show("Failed to fetch data");
        } else {
            boolean isFavorite = Storage.isFavorite(ticker);
            if (isFavorite) {
                Storage.removeFromFavorites(ticker);
                toastManager.show(String.format("\"%s\" was removed from favorites", ticker));
            } else {
                FavoritesItem favoritesItem = FavoritesItem.with(ticker, info.getName(), info.getLastPrice());
                Storage.addToFavorites(favoritesItem);
                toastManager.show(String.format("\"%s\" was added to favorites", ticker));
            }
            int icon = getFavoriteIcon(!isFavorite);
            item.setIcon(icon);
        }
    }

    private int getFavoriteIcon(boolean isFavorite) {
        return isFavorite ? R.drawable.ic_baseline_star_24 : R.drawable.ic_baseline_star_border_24;
    }

    public void onFooterClick(View view) {
        Uri uri = Uri.parse("https://www.tiingo.com");
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        startActivity(intent);
    }
}