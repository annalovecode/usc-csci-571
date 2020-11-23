package com.rochakgupta.stocktrading.main.portfolio;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.View;

import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.common.Formatter;

import java.util.ArrayList;
import java.util.List;

import io.github.luizgrp.sectionedrecyclerviewadapter.Section;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionAdapter;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionParameters;
import io.github.luizgrp.sectionedrecyclerviewadapter.utils.EmptyViewHolder;

public class PortfolioSection extends Section {
    private final Context context;
    private final List<PortfolioItem> items;
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

    public void setItems(List<PortfolioItem> newItems, SectionAdapter adapter) {
        int count = getContentItemsTotal();
        if (newItems.isEmpty() && count > 0) {
            items.clear();
            adapter.notifyItemRangeRemoved(0, count);
        } else if (!newItems.isEmpty() && count == 0) {
            items.addAll(newItems);
            adapter.notifyAllItemsInserted();
        } else if (!newItems.isEmpty() && count > 0) {
            items.clear();
            adapter.notifyItemRangeRemoved(0, count);
            items.addAll(newItems);
            adapter.notifyAllItemsInserted();
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
        if (item.isLastPriceSet()) {
            viewHolder.lastPriceView.setText(Formatter.getPriceString(item.getLastPrice()));
            viewHolder.changeView.setText(Formatter.getPriceString(item.getChange()));
            viewHolder.changeView.setTextColor(context.getColor(item.getChangeColor()));
            if (item.showTrending()) {
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
