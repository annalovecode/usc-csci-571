package com.rochakgupta.stocktrading.main.section.portfolio;

import android.view.View;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.R;

public class PortfolioHeaderViewHolder extends RecyclerView.ViewHolder {

    final TextView netWorthView;

    public PortfolioHeaderViewHolder(View view) {
        super(view);
        netWorthView = (TextView) view.findViewById(R.id.portfolio_tv_net_worth);;
    }
}