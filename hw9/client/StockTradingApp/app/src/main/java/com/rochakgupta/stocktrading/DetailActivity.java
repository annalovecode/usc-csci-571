package com.rochakgupta.stocktrading;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.GridView;
import android.widget.TextView;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.widget.NestedScrollView;

import com.rochakgupta.stocktrading.api.Api;
import com.rochakgupta.stocktrading.api.ApiStatus;
import com.rochakgupta.stocktrading.detail.about.AboutManager;
import com.rochakgupta.stocktrading.detail.ChartItem;
import com.rochakgupta.stocktrading.detail.Everything;
import com.rochakgupta.stocktrading.detail.Info;
import com.rochakgupta.stocktrading.detail.NewsItem;
import com.rochakgupta.stocktrading.detail.portfolio.PortfolioManager;
import com.rochakgupta.stocktrading.detail.stats.Stat;
import com.rochakgupta.stocktrading.detail.stats.StatsAdapter;
import com.rochakgupta.stocktrading.format.FormattingUtils;
import com.rochakgupta.stocktrading.gson.GsonUtils;
import com.rochakgupta.stocktrading.log.LoggingUtils;
import com.rochakgupta.stocktrading.storage.Storage;
import com.rochakgupta.stocktrading.toast.ToastManager;

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
    private PortfolioManager portfolioManager;
    private AboutManager aboutManager;

    private ToastManager toastManager;

    private ApiStatus everythingFetchStatus;

    private Info info;

    private NewsItem[] news;

    private ChartItem[] chart;

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

        everythingFetchStatus = new ApiStatus();
        everythingFetchStatus.loading();

        showLoadingLayout();

        startEverythingFetch();
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

    private void startEverythingFetch() {
        Api.makeEverythingFetchRequest(ticker, response -> {
            try {
                JSONObject jsonData = response.getJSONObject("data");
                LoggingUtils.logJSONObject(jsonData);
                Everything everything = GsonUtils.jsonToEverything(jsonData.toString());
                onEverythingFetchSuccess(everything);
            } catch (JSONException e) {
                e.printStackTrace();
                onEverythingFetchError();
            }
        }, error -> {
            LoggingUtils.logError(error);
            onEverythingFetchError();
        });
    }

    private void onEverythingFetchSuccess(Everything everything) {
        info = everything.getInfo();
        news = everything.getNews();
        chart = everything.getChart();
        initializeInfoView();
        initializePortfolioView();
        initializeStatsGrid();
        initializeAboutView();
        showSuccessLayout();
        everythingFetchStatus.success();
    }

    private void initializeInfoView() {
        TextView tickerView = findViewById(R.id.detail_tv_info_ticker);
        tickerView.setText(ticker);
        TextView nameView = findViewById(R.id.detail_tv_info_name);
        nameView.setText(info.getName());
        TextView lastPriceView = findViewById(R.id.detail_tv_info_last_price);
        lastPriceView.setText(FormattingUtils.getPriceStringWithSymbol(info.getLastPrice()));
        TextView changeView = findViewById(R.id.detail_tv_info_change);
        changeView.setText(FormattingUtils.getPriceStringWithSymbol(info.getChange()));
        changeView.setTextColor(getColor(info.getChangeColor()));
    }

    private void initializePortfolioView() {
        portfolioManager = new PortfolioManager(this, toastManager, info);
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
        aboutManager = new AboutManager(this, info.getDescription());
        aboutManager.display();
    }

    private void onEverythingFetchError() {
        showErrorView();
        everythingFetchStatus.error();
    }

    private void showSuccessLayout() {
        loadingLayout.setVisibility(View.INVISIBLE);
        errorView.setVisibility(View.INVISIBLE);
        successView.setVisibility(View.VISIBLE);
    }

    @Override
    protected void onDestroy() {
        Api.cancelEverythingFetchRequest();
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
        if (everythingFetchStatus.isLoading()) {
            toastManager.show("Still fetching data");
        } else if (everythingFetchStatus.isError()) {
            toastManager.show("Failed to fetch data");
        } else {
            boolean isFavorite = Storage.isFavorite(ticker);
            if (isFavorite) {
                Storage.removeFromFavorites(ticker);
                toastManager.show(String.format("\"%s\" was removed from favorites", ticker));
            } else {
                Storage.addToFavorites(ticker, info.getName(), info.getLastPrice());
                toastManager.show(String.format("\"%s\" was added to favorites", ticker));
            }
            int icon = getFavoriteIcon(!isFavorite);
            item.setIcon(icon);
        }
    }

    private int getFavoriteIcon(boolean isFavorite) {
        return isFavorite ? R.drawable.ic_baseline_star_24 : R.drawable.ic_baseline_star_border_24;
    }
}