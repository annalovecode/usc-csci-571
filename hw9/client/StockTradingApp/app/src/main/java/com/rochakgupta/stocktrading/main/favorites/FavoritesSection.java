package com.rochakgupta.stocktrading.main.favorites;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.View;

import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.format.FormattingUtils;

import java.util.ArrayList;
import java.util.List;

import io.github.luizgrp.sectionedrecyclerviewadapter.Section;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionAdapter;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionParameters;
import io.github.luizgrp.sectionedrecyclerviewadapter.utils.EmptyViewHolder;

public class FavoritesSection extends Section {
    private final Context context;
    private final List<FavoritesItem> items;
    private final ClickListener clickListener;

    public interface ClickListener {
        void onFavoritesItemClicked(FavoritesItem item);
    }

    public FavoritesSection(Context context, ClickListener clickListener) {
        super(SectionParameters.builder()
                               .itemResourceId(R.layout.favorites_item)
                               .headerResourceId(R.layout.favorites_header)
                               .build());
        this.context = context;
        this.items = new ArrayList<>();
        this.clickListener = clickListener;
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
        if (item.isCurrentPriceSet()) {
            viewHolder.currentPriceView.setText(FormattingUtils.getPriceString(item.getCurrentPrice()));
            viewHolder.changeView.setText(FormattingUtils.getPriceString(item.getChange()));
            viewHolder.changeView.setTextColor(context.getColor(item.getChangeColor()));
            if (item.showTrending()) {
                viewHolder.trendingView.setImageResource(item.getTrendingDrawable());
                viewHolder.trendingView.setVisibility(View.VISIBLE);
            } else {
                viewHolder.trendingView.setVisibility(View.INVISIBLE);
            }
        }
        viewHolder.arrowView.setOnClickListener(v -> clickListener.onFavoritesItemClicked(item));
    }

    @Override
    public RecyclerView.ViewHolder getHeaderViewHolder(View view) {
        return new EmptyViewHolder(view);
    }
}
