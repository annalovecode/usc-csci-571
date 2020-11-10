package com.rochakgupta.stocktrading;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.Theme_StockTradingApp);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
}