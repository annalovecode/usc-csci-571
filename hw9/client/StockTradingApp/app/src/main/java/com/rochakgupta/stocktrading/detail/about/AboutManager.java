package com.rochakgupta.stocktrading.detail.about;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.text.Layout;
import android.text.TextUtils;
import android.view.View;
import android.widget.TextView;

import com.rochakgupta.stocktrading.R;

public class AboutManager {
    private final TextView aboutView;

    private final TextView aboutTogglerView;

    private final String description;

    private boolean collapsed;

    public AboutManager(Activity activity, String description) {
        aboutView = activity.findViewById(R.id.detail_tv_about);
        aboutTogglerView = activity.findViewById(R.id.detail_tv_about_toggler);
        this.description = description;
    }

    public void display() {
        aboutView.setText(description);
        Layout layout = aboutView.getLayout();
        if (layout.getLineCount() > 2) {
            aboutTogglerView.setVisibility(View.VISIBLE);
            initializeToggler();
            collapse();
        } else {
            aboutTogglerView.setVisibility(View.GONE);
        }
    }

    private void initializeToggler() {
        aboutTogglerView.setOnClickListener(v -> {
            if (collapsed) {
                expand();
            } else {
                collapse();
            }
        });
    }

    @SuppressLint("SetTextI18n")
    private void expand() {
        collapsed = false;
        aboutView.setEllipsize(null);
        aboutView.setMaxLines(Integer.MAX_VALUE);
        aboutTogglerView.setText("Show less");
    }

    @SuppressLint("SetTextI18n")
    private void collapse() {
        collapsed = true;
        aboutView.setEllipsize(TextUtils.TruncateAt.END);
        aboutView.setMaxLines(2);
        aboutTogglerView.setText("Show more...");
    }
}
