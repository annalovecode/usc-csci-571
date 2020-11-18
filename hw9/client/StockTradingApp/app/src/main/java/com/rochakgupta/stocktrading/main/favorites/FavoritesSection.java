package com.rochakgupta.stocktrading.main.favorites;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.View;

import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.R;

import java.util.Collections;
import java.util.List;

import io.github.luizgrp.sectionedrecyclerviewadapter.Section;
import io.github.luizgrp.sectionedrecyclerviewadapter.SectionParameters;
import io.github.luizgrp.sectionedrecyclerviewadapter.utils.EmptyViewHolder;

public class FavoritesSection extends Section {
    private final Context context;
    private List<FavoritesItem> items;
    private final OnClickListener onClickListener;

    public interface OnClickListener {
        void onFavoritesItemClicked(FavoritesItem item);
    }

    public FavoritesSection(Context context, OnClickListener onClickListener) {
        super(SectionParameters.builder()
                               .itemResourceId(R.layout.favorites_section_item)
                               .headerResourceId(R.layout.favorites_section_header)
                               .footerResourceId(R.layout.favorites_section_footer)
                               .build());
        this.context = context;
        this.items = Collections.emptyList();
        this.onClickListener = onClickListener;
    }

    public void setItems(List<FavoritesItem> items) {
        this.items = items;
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
        viewHolder.currentPriceView.setText(item.getCurrentPrice().toString());
        viewHolder.changeView.setText(item.getChange().toString());
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

    @Override
    public RecyclerView.ViewHolder getFooterViewHolder(View view) {
        return new EmptyViewHolder(view);
    }
}
