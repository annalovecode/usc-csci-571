package com.rochakgupta.stocktrading.detail.news;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.R;

public class NewsAdapterViewHolder extends RecyclerView.ViewHolder {
    final ImageView imageView;

    final TextView publisherView;

    final TextView publishedAtView;

    final TextView titleView;

    public NewsAdapterViewHolder(@NonNull View itemView) {
        super(itemView);

        imageView = itemView.findViewById(R.id.news_iv);
        publisherView = itemView.findViewById(R.id.news_tv_publisher);
        publishedAtView = itemView.findViewById(R.id.news_tv_published_at);
        titleView = itemView.findViewById(R.id.news_tv_title);
    }
}