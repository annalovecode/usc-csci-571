package com.rochakgupta.stocktrading.detail.news;

import android.app.Dialog;
import android.content.Context;
import android.widget.ImageButton;
import android.widget.TextView;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.detail.NewsItem;

public class NewsDialog {
    private final Dialog dialog;

    private final TextView titleView;

    private final ActionListener actionListener;

    private NewsItem item;

    interface ActionListener {
        void onShare(NewsItem item);
        void onView(NewsItem item);
    }

    public NewsDialog(Context context, ActionListener actionListener) {
        dialog = new Dialog(context);
        dialog.setContentView(R.layout.news_dialog);

        titleView = dialog.findViewById(R.id.news_dialog_tv_title);

        this.actionListener = actionListener;

        initializeShareButton();
        initializeViewButton();
    }

    private void reset(NewsItem item) {
        this.item = item;
        initializeTitleText();
    }

    public void show(NewsItem item) {
        reset(item);
        dialog.show();
    }

    private void initializeTitleText() {
        titleView.setText(item.getTitle());
    }

    private void initializeShareButton() {
        ImageButton shareButton = dialog.findViewById(R.id.news_dialog_b_share);
        shareButton.setOnClickListener(v1 -> {
            this.actionListener.onShare(item);
        });
    }

    public void initializeViewButton() {
        ImageButton viewButton = dialog.findViewById(R.id.news_dialog_b_view);
        viewButton.setOnClickListener(v1 -> {
            this.actionListener.onView(item);
        });
    }
}