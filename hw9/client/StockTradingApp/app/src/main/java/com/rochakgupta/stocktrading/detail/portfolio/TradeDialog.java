package com.rochakgupta.stocktrading.detail.portfolio;

import android.app.Dialog;
import android.content.Context;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.detail.Info;

public class TradeDialog {
    private final Dialog dialog;

    private Info info;

    private int stocks;

    public TradeDialog(Context context, Info info) {
        dialog = new Dialog(context);
        dialog.setContentView(R.layout.trade_dialog);

        TextView titleView = dialog.findViewById(R.id.trade_tv_title);
        titleView.setText(String.format("Trade %s shares", info.getName()));

        Button buyButton = dialog.findViewById(R.id.trade_b_buy);
        buyButton.setOnClickListener(v1 -> {
            buy();
        });

        Button sellButton = dialog.findViewById(R.id.trade_b_sell);
        sellButton.setOnClickListener(v1 -> {
            sell();
        });

        Window window = dialog.getWindow();
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
    }

    public void show() {
        dialog.show();
    }

    private void buy() {

    }

    private void sell() {

    }
}