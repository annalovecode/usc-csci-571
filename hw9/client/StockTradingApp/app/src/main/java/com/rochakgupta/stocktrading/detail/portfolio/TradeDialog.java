package com.rochakgupta.stocktrading.detail.portfolio;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.detail.Info;
import com.rochakgupta.stocktrading.common.Formatter;
import com.rochakgupta.stocktrading.common.Storage;

public class TradeDialog {
    private final Dialog dialog;

    private final EditText stocksEditText;

    private final TextView stocksPriceView;

    private final OnActionHandler actionHandler;

    private final Info info;

    private int stocks;

    interface OnActionHandler {
        void onStockBuy(int stocks);
        void onStockSell(int stocks);
    }

    public TradeDialog(Context context, Info info, OnActionHandler actionHandler) {
        dialog = new Dialog(context);
        dialog.setContentView(R.layout.trade_dialog);

        stocksEditText = dialog.findViewById(R.id.trade_et_stocks);
        stocksPriceView = dialog.findViewById(R.id.trade_tv_stocks_price);

        Window window = dialog.getWindow();
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);

        this.info = info;

        this.actionHandler = actionHandler;

        initializeTitleText();
        initializeStocksEditText();
        initializeStocksPriceView();
        initializeBuyButton();
        initializeSellButton();
    }

    private void reset() {
        stocks = 0;
        stocksEditText.setText("");
        initializeAvailableAmountView();
    }

    public void show() {
        reset();
        dialog.show();
    }

    public void dismiss() {
        dialog.dismiss();
    }

    private void initializeTitleText() {
        TextView titleView = dialog.findViewById(R.id.trade_tv_title);
        titleView.setText(String.format("Trade %s shares", info.getName()));
    }

    private void initializeStocksEditText() {
        stocksEditText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (s.length() == 0) {
                    stocks = 0;
                } else {
                    stocks = Integer.parseInt(s.toString());
                }
                initializeStocksPriceView();
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
    }

    @SuppressLint("DefaultLocale")
    private void initializeStocksPriceView() {
        String lastPriceString = Formatter.getPriceStringWithSymbol(info.getLastPrice());
        String stocksPriceString = Formatter.getPriceStringWithSymbol(stocks * info.getLastPrice());
        stocksPriceView.setText(String.format("%d x %s/share = %s", stocks, lastPriceString, stocksPriceString));
    }

    private void initializeAvailableAmountView() {
        TextView availableAmountView = dialog.findViewById(R.id.trade_tv_available_amount);
        String balanceString = Formatter.getPriceStringWithSymbol(Storage.getBalance());
        availableAmountView.setText(String.format("%s available to buy %s", balanceString, info.getTicker()));
    }

    private void initializeBuyButton() {
        Button buyButton = dialog.findViewById(R.id.trade_b_buy);
        buyButton.setOnClickListener(v1 -> {
            this.actionHandler.onStockBuy(stocks);
        });
    }

    public void initializeSellButton() {
        Button sellButton = dialog.findViewById(R.id.trade_b_sell);
        sellButton.setOnClickListener(v1 -> {
            this.actionHandler.onStockSell(stocks);
        });
    }
}