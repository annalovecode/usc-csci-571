package com.rochakgupta.stocktrading.main.section;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.DetailActivity;
import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.common.Storage;
import com.rochakgupta.stocktrading.main.section.favorites.FavoritesItem;
import com.rochakgupta.stocktrading.main.section.favorites.FavoritesSection;
import com.rochakgupta.stocktrading.main.section.portfolio.PortfolioItem;
import com.rochakgupta.stocktrading.main.section.portfolio.PortfolioSection;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import io.github.luizgrp.sectionedrecyclerviewadapter.SectionAdapter;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionedRecyclerViewAdapter;

public class SectionsManager implements PortfolioSection.OnClickHandler, FavoritesSection.OnClickHandler,
        SectionTouchCallback.OnActionHandler {

    private final Context context;

    private PortfolioSection portfolioSection;

    private FavoritesSection favoritesSection;

    private SectionedRecyclerViewAdapter adapter;

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
        RecyclerView recyclerView = activity.findViewById(R.id.main_rv_success);
        recyclerView.addItemDecoration(new DividerItemDecoration(context, DividerItemDecoration.VERTICAL));
        recyclerView.setLayoutManager(new LinearLayoutManager(context));
        recyclerView.setAdapter(adapter);
        initializeTouchActions(recyclerView);
    }

    private void initializeTouchActions(RecyclerView recyclerView) {
        SectionTouchCallback callback = new SectionTouchCallback(context, adapter, this);
        ItemTouchHelper helper = new ItemTouchHelper(callback);
        helper.attachToRecyclerView(recyclerView);
    }

    public void initializeSections() {
        portfolioSection.setBalance(Storage.getBalance());
        portfolioSection.setItems(Storage.getPortfolio());
        favoritesSection.setItems(Storage.getFavorites());
        adapter.notifyDataSetChanged();
    }

    public void updateSections(Map<String, Double> lastPrices) {
        portfolioSection.updateItems(lastPrices);
        Map<String, Integer> stocks = portfolioSection.getItems().stream().collect(
                Collectors.toMap(PortfolioItem::getTicker, PortfolioItem::getStocks));
        favoritesSection.updateItems(lastPrices, stocks);
        adapter.notifyDataSetChanged();
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

    @Override
    public void onFavoritesItemSwipe(int position) {
        FavoritesItem item = favoritesSection.getItem(position);
        favoritesSection.removeItem(position);
        SectionAdapter favoritesAdapter = adapter.getAdapterForSection(favoritesSection);
        favoritesAdapter.notifyItemRemoved(position);
        Storage.removeFromFavorites(item.getTicker());
    }

    @Override
    public void onFavoritesItemMove(int fromPosition, int toPosition) {
        favoritesSection.moveItem(fromPosition, toPosition);
        SectionAdapter favoritesAdapter = adapter.getAdapterForSection(favoritesSection);
        favoritesAdapter.notifyItemMoved(fromPosition, toPosition);
        Storage.updateFavorites(favoritesSection.getItems());
    }

    @Override
    public void onPortfolioItemMove(int fromPosition, int toPosition) {
        portfolioSection.moveItem(fromPosition, toPosition);
        SectionAdapter portfolioAdapter = adapter.getAdapterForSection(portfolioSection);
        portfolioAdapter.notifyItemMoved(fromPosition, toPosition);
        Storage.updatePortfolio(portfolioSection.getItems());
    }

    public List<String> getTickers() {
        Set<String> tickers = getPortfolioTickers();
        tickers.addAll(getFavoritesTickers());
        return new ArrayList<>(tickers);
    }

    private Set<String> getPortfolioTickers() {
        return portfolioSection.getItems().stream().map(PortfolioItem::getTicker).collect(Collectors.toSet());
    }

    private Set<String> getFavoritesTickers() {
        return favoritesSection.getItems().stream().map(FavoritesItem::getTicker).collect(Collectors.toSet());
    }

    private void startDetailActivity(String ticker) {
        Intent intent = new Intent(context, DetailActivity.class);
        intent.putExtra("ticker", ticker);
        context.startActivity(intent);
    }
}
