package com.rochakgupta.stocktrading.main.favorites;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.View;

import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.R;

import java.util.List;

import io.github.luizgrp.sectionedrecyclerviewadapter.Section;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionAdapter;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionParameters;
import io.github.luizgrp.sectionedrecyclerviewadapter.utils.EmptyViewHolder;

public class FavoritesSection extends Section {
    private final Context context;
    private List<FavoritesItem> items;
    private final OnClickListener onClickListener;

    public interface OnClickListener {
        void onFavoritesItemClicked(FavoritesItem item);
    }

    public FavoritesSection(Context context, List<FavoritesItem> items, OnClickListener onClickListener) {
        super(SectionParameters.builder()
                               .itemResourceId(R.layout.favorites_section_item)
                               .headerResourceId(R.layout.favorites_section_header)
                               .build());
        this.context = context;
        this.items = items;
        this.onClickListener = onClickListener;
    }

    public void setItems(List<FavoritesItem> newItems, SectionAdapter adapter) {
        if (newItems.isEmpty()) {
            int count = getContentItemsTotal();
            items.clear();
            adapter.notifyItemRangeRemoved(0, count);
        } else if (items.isEmpty()) {
            items.addAll(newItems);
            adapter.notifyAllItemsInserted();
        } else {
            int count = getContentItemsTotal();
            items.clear();
            items.addAll(newItems);
            int newCount = newItems.size();
            if (count < newCount) {
                adapter.notifyItemRangeChanged(0, count);
                adapter.notifyItemRangeInserted(count, newCount);
            } else if (count > newCount) {
                adapter.notifyItemRangeChanged(0, count);
                adapter.notifyItemRangeRemoved(count, newCount);
            } else {
                adapter.notifyAllItemsChanged(null);
            }
        }
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
        viewHolder.currentPriceView.setText(String.valueOf(item.getCurrentPrice()));
        viewHolder.changeView.setText(String.valueOf(item.getChange()));
        viewHolder.changeView.setTextColor(context.getColor(item.getChangeColor()));
        if (item.getShowTrending()) {
            viewHolder.trendingView.setImageResource(item.getTrendingDrawable());
            viewHolder.trendingView.setVisibility(View.VISIBLE);
        } else {
            viewHolder.trendingView.setVisibility(View.INVISIBLE);
        }
        viewHolder.arrowView.setOnClickListener(v -> onClickListener.onFavoritesItemClicked(item));
    }

    @Override
    public RecyclerView.ViewHolder getHeaderViewHolder(View view) {
        return new EmptyViewHolder(view);
    }
}
