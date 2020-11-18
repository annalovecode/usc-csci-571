package com.rochakgupta.stocktrading.main.favorites;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.R;

public class FavoritesItemViewHolder extends RecyclerView.ViewHolder {
    final TextView tickerView;

    final TextView descriptionView;

    final TextView currentPriceView;

    final TextView changeView;

    final ImageView trendingView;

    final ImageView arrowView;

    public FavoritesItemViewHolder(View view) {
        super(view);
        tickerView = (TextView) view.findViewById(R.id.fav_item_tv_ticker);
        descriptionView = (TextView) view.findViewById(R.id.fav_item_tv_description);
        currentPriceView = (TextView) view.findViewById(R.id.fav_item_tv_current_price);
        changeView = (TextView) view.findViewById(R.id.fav_item_tv_change);
        trendingView = (ImageView) view.findViewById(R.id.fav_item_iv_trending);
        arrowView = (ImageView) view.findViewById(R.id.fav_item_iv_arrow);
    }
}