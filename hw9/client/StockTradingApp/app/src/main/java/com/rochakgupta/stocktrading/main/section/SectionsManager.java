package com.rochakgupta.stocktrading.main.section;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.DetailActivity;
import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.common.Storage;
import com.rochakgupta.stocktrading.main.section.common.SectionViewHolderTouchCallback;
import com.rochakgupta.stocktrading.main.section.favorites.FavoritesItem;
import com.rochakgupta.stocktrading.main.section.favorites.FavoritesSection;
import com.rochakgupta.stocktrading.main.section.portfolio.PortfolioItem;
import com.rochakgupta.stocktrading.main.section.portfolio.PortfolioSection;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import io.github.luizgrp.sectionedrecyclerviewadapter.SectionedRecyclerViewAdapter;

public class SectionsManager implements PortfolioSection.OnClickHandler, FavoritesSection.OnClickHandler {

    private final Context context;

    private PortfolioSection portfolioSection;

    private FavoritesSection favoritesSection;

    private SectionedRecyclerViewAdapter adapter;

    private RecyclerView recyclerView;

    public SectionsManager(Activity activity, Context context) {
        this.context = context;
        initializeAdapter();
        initializeRecyclerView(activity);
    }

    private void initializeAdapter() {
        adapter = new SectionedRecyclerViewAdapter();
        portfolioSection = new PortfolioSection(context, this);
        favoritesSection = new FavoritesSection(context, this);
        adapter.addSection(portfolioSection);
        adapter.addSection(favoritesSection);
    }

    private void initializeRecyclerView(Activity activity) {
        recyclerView = activity.findViewById(R.id.main_rv_success);
        recyclerView.addItemDecoration(new DividerItemDecoration(context, DividerItemDecoration.VERTICAL));
        recyclerView.setLayoutManager(new LinearLayoutManager(context));
        recyclerView.setAdapter(adapter);
        initializeTouchActions();
    }

    private void initializeTouchActions() {
        SectionViewHolderTouchCallback callback = new SectionViewHolderTouchCallback(context) {
            @Override
            public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {

            }
        };
        ItemTouchHelper helper = new ItemTouchHelper(callback);
        helper.attachToRecyclerView(recyclerView);
    }

    public void initializeSections() {
        portfolioSection.setItems(Storage.getPortfolio());
        favoritesSection.setItems(Storage.getFavorites());
        adapter.notifyDataSetChanged();
    }

    public void updateSections(Map<String, Double> lastPrices) {
        Map<String, Integer> stocks = updatePortfolioSection(lastPrices);
        updateFavoritesSection(lastPrices, stocks);
        adapter.notifyDataSetChanged();
    }

    private Map<String, Integer> updatePortfolioSection(Map<String, Double> lastPrices) {
        List<PortfolioItem> items = portfolioSection.getItems();
        items.forEach(item -> item.setLastPrice(lastPrices.get(item.getTicker())));
        return items.stream().collect(Collectors.toMap(PortfolioItem::getTicker, PortfolioItem::getStocks));
    }

    private void updateFavoritesSection(Map<String, Double> lastPrices, Map<String, Integer> stocks) {
        List<FavoritesItem> items = favoritesSection.getItems();
        items.forEach(item -> {
            String ticker = item.getTicker();
            item.setLastPrice(lastPrices.get(ticker));
            item.setStocks(stocks.get(ticker));
        });
    }

    public List<String> getTickers() {
        Set<String> tickers = getPortfolioTickers();
        tickers.addAll(getFavoritesTickers());
        return new ArrayList<>(tickers);
    }

    @Override
    public void onFavoritesItemClick(FavoritesItem item) {
        String ticker = item.getTicker();
        startDetailActivity(ticker);
    }

    @Override
    public void onPortfolioItemClick(PortfolioItem item) {
        String ticker = item.getTicker();
        startDetailActivity(ticker);
    }

    private Set<String> getPortfolioTickers() {
        return portfolioSection
                .getItems()
                .stream().map(PortfolioItem::getTicker)
                .collect(Collectors.toSet());
    }

    private Set<String> getFavoritesTickers() {
        return favoritesSection
                .getItems()
                .stream().map(FavoritesItem::getTicker)
                .collect(Collectors.toSet());
    }

    private void startDetailActivity(String ticker) {
        Intent intent = new Intent(context, DetailActivity.class);
        intent.putExtra("ticker", ticker);
        context.startActivity(intent);
    }
}
