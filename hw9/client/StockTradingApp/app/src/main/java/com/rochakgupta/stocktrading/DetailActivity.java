package com.rochakgupta.stocktrading;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.rochakgupta.stocktrading.storage.StockPreferences;

public class DetailActivity extends AppCompatActivity {
    private static final String TAG = DetailActivity.class.getSimpleName();

    private String ticker;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.Theme_StockTradingApp);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detail);

        initializeActionBar();

        StockPreferences.initialize(this);

        Intent intent = getIntent();
        if (!intent.hasExtra("ticker")) {
            throw new RuntimeException("DetailActivity needs ticker in intent to run");
        }
        ticker = intent.getStringExtra("ticker");
    }

    private void initializeActionBar() {
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.detail, menu);
        MenuItem item = menu.findItem(R.id.action_favorite);
        setFavoriteMenuItem(item);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int itemId = item.getItemId();
        if (itemId == android.R.id.home) {
            onBackPressed();
            return true;
        } else if (itemId == R.id.action_favorite) {
            if (StockPreferences.isFavorite(ticker)) {
                StockPreferences.removeFromFavorites(ticker);
            } else {
//            StockPreferences.addToFavorite(item);
            }
            setFavoriteMenuItem(item);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void setFavoriteMenuItem(MenuItem item) {
        if (StockPreferences.isFavorite(ticker)) {
            item.setIcon(R.drawable.ic_baseline_star_24);
        } else {
            item.setIcon(R.drawable.ic_baseline_star_border_24);
        }
    }
}