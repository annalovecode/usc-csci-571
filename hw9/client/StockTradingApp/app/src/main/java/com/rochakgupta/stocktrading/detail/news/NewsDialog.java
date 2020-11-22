package com.rochakgupta.stocktrading.detail.news;

import android.app.Dialog;
import android.content.Context;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.detail.NewsItem;

public class NewsDialog {
    private final Context context;

    private final Dialog dialog;

    private final TextView titleView;

    private final ImageView imageView;

    private final ActionListener actionListener;

    private NewsItem item;

    interface ActionListener {
        void onNewsShare(NewsItem item);
        void onNewsView(NewsItem item);
    }

    public NewsDialog(Context context, ActionListener actionListener) {
        this.context = context;

        dialog = new Dialog(context);
        dialog.setContentView(R.layout.news_dialog);

        titleView = dialog.findViewById(R.id.news_dialog_tv_title);
        imageView = dialog.findViewById(R.id.news_dialog_iv);

        this.actionListener = actionListener;

        initializeShareButton();
        initializeViewButton();
    }

    private void reset(NewsItem item) {
        this.item = item;
        initializeTitleText();
        initializeImageView();
    }

    public void show(NewsItem item) {
        reset(item);
        dialog.show();
    }

    private void initializeTitleText() {
        titleView.setText(item.getTitle());
    }

    private void initializeImageView() {
        ImageLoader.load(context, imageView, item.getUrlToImage());
    }

    private void initializeShareButton() {
        ImageButton shareButton = dialog.findViewById(R.id.news_dialog_b_share);
        shareButton.setOnClickListener(v1 -> {
            this.actionListener.onNewsShare(item);
        });
    }

    public void initializeViewButton() {
        ImageButton viewButton = dialog.findViewById(R.id.news_dialog_b_view);
        viewButton.setOnClickListener(v1 -> {
            this.actionListener.onNewsView(item);
        });
    }
}