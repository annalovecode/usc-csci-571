package com.rochakgupta.stocktrading.main.section.favorites;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.View;

import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.common.Formatter;

import java.util.ArrayList;
import java.util.List;

import io.github.luizgrp.sectionedrecyclerviewadapter.Section;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionParameters;
import io.github.luizgrp.sectionedrecyclerviewadapter.utils.EmptyViewHolder;

public class FavoritesSection extends Section {
    private final Context context;
    private List<FavoritesItem> items;
    private final OnClickHandler clickHandler;

    public interface OnClickHandler {
        void onFavoritesItemClick(FavoritesItem item);
    }

    public FavoritesSection(Context context, OnClickHandler clickHandler) {
        super(SectionParameters.builder()
                               .itemResourceId(R.layout.favorites_item)
                               .headerResourceId(R.layout.favorites_header)
                               .build());
        this.context = context;
        this.items = new ArrayList<>();
        this.clickHandler = clickHandler;
    }

    public void setItems(List<FavoritesItem> items) {
        this.items = items;
    }

    public List<FavoritesItem> getItems() {
        return items;
    }

    public FavoritesItem getItem(int position) {
        return items.get(position);
    }

    public void removeItem(int position) {
        items.remove(position);
    }

    @Override
    public int getContentItemsTotal() {
        return items.size();
    }

    @Override
    public RecyclerView.ViewHolder getItemViewHolder(View view) {
        return new FavoritesItemViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindItemViewHolder(RecyclerView.ViewHolder holder, int position) {
        FavoritesItemViewHolder viewHolder = (FavoritesItemViewHolder) holder;
        FavoritesItem item = items.get(position);
        viewHolder.tickerView.setText(item.getTicker());
        viewHolder.descriptionView.setText(item.getDescription());
        if (item.hasLastPrice()) {
            viewHolder.lastPriceView.setText(Formatter.getPriceString(item.getLastPrice()));
            viewHolder.changeView.setText(Formatter.getPriceString(item.getChange()));
            viewHolder.changeView.setTextColor(context.getColor(item.getChangeColor()));
            if (item.hasTrendingDrawable()) {
                viewHolder.trendingView.setImageResource(item.getTrendingDrawable());
                viewHolder.trendingView.setVisibility(View.VISIBLE);
            } else {
                viewHolder.trendingView.setVisibility(View.INVISIBLE);
            }
        }
        viewHolder.arrowView.setOnClickListener(v -> clickHandler.onFavoritesItemClick(item));
    }

    @Override
    public RecyclerView.ViewHolder getHeaderViewHolder(View view) {
        return new EmptyViewHolder(view);
    }
}
