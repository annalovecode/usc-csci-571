package com.rochakgupta.stocktrading.main.section.portfolio;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.View;

import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.common.Formatter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import io.github.luizgrp.sectionedrecyclerviewadapter.Section;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionParameters;
import io.github.luizgrp.sectionedrecyclerviewadapter.utils.EmptyViewHolder;

public class PortfolioSection extends Section {
    private final Context context;
    private List<PortfolioItem> items;
    private final OnClickHandler clickHandler;

    public interface OnClickHandler {
        void onPortfolioItemClick(PortfolioItem item);
    }

    public PortfolioSection(Context context, OnClickHandler clickHandler) {
        super(SectionParameters.builder()
                               .itemResourceId(R.layout.portfolio_item)
                               .headerResourceId(R.layout.portfolio_header)
                               .build());
        this.context = context;
        this.items = new ArrayList<>();
        this.clickHandler = clickHandler;
    }

    public void setItems(List<PortfolioItem> items) {
        this.items = items;
    }

    public List<PortfolioItem> getItems() {
        return items;
    }

    public void moveItem(int fromPosition, int toPosition) {
        if (fromPosition < toPosition) {
            for (int i = fromPosition; i < toPosition; i++) {
                Collections.swap(items, i, i + 1);
            }
        } else {
            for (int i = fromPosition; i > toPosition; i--) {
                Collections.swap(items, i, i - 1);
            }
        }
    }

    @Override
    public int getContentItemsTotal() {
        return items.size();
    }

    @Override
    public RecyclerView.ViewHolder getItemViewHolder(View view) {
        return new PortfolioItemViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindItemViewHolder(RecyclerView.ViewHolder holder, int position) {
        PortfolioItemViewHolder viewHolder = (PortfolioItemViewHolder) holder;
        PortfolioItem item = items.get(position);
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
        viewHolder.arrowView.setOnClickListener(v -> clickHandler.onPortfolioItemClick(item));
    }

    @Override
    public RecyclerView.ViewHolder getHeaderViewHolder(View view) {
        return new EmptyViewHolder(view);
    }
}
