package com.rochakgupta.stocktrading.main.portfolio;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.R;

public class PortfolioItemViewHolder extends RecyclerView.ViewHolder {
    final TextView tickerView;

    final TextView descriptionView;

    final TextView lastPriceView;

    final TextView changeView;

    final ImageView trendingView;

    final ImageView arrowView;

    public PortfolioItemViewHolder(View view) {
        super(view);
        tickerView = (TextView) view.findViewById(R.id.portfolio_tv_ticker);
        descriptionView = (TextView) view.findViewById(R.id.portfolio_tv_description);
        lastPriceView = (TextView) view.findViewById(R.id.portfolio_tv_last_price);
        changeView = (TextView) view.findViewById(R.id.portfolio_tv_change);
        trendingView = (ImageView) view.findViewById(R.id.portfolio_iv_trending);
        arrowView = (ImageView) view.findViewById(R.id.portfolio_iv_arrow);
    }
}