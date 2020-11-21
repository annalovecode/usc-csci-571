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
import com.rochakgupta.stocktrading.format.FormattingUtils;
import com.rochakgupta.stocktrading.storage.Storage;

public class TradeDialog {
    private final Dialog dialog;

    private final EditText stocksEditText;

    private final TextView stocksPriceView;

    private final ActionListener actionListener;

    private final Info info;

    private int stocks;

    interface ActionListener {
        void onStockBuy(int stocks);
        void onStockSell(int stocks);
    }

    public TradeDialog(Context context, Info info, ActionListener actionListener) {
        dialog = new Dialog(context);
        dialog.setContentView(R.layout.trade_dialog);

        stocksEditText = dialog.findViewById(R.id.trade_et_stocks);
        stocksPriceView = dialog.findViewById(R.id.trade_tv_stocks_price);

        Window window = dialog.getWindow();
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);

        this.info = info;

        this.actionListener = actionListener;

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
        String lastPriceString = FormattingUtils.getPriceStringWithSymbol(info.getLastPrice());
        String stocksPriceString = FormattingUtils.getPriceStringWithSymbol(stocks * info.getLastPrice());
        stocksPriceView.setText(String.format("%d x %s/share = %s", stocks, lastPriceString, stocksPriceString));
    }

    private void initializeAvailableAmountView() {
        TextView availableAmountView = dialog.findViewById(R.id.trade_tv_available_amount);
        String balanceString = FormattingUtils.getPriceStringWithSymbol(Storage.getBalance());
        availableAmountView.setText(String.format("%s available to buy %s", balanceString, info.getTicker()));
    }

    private void initializeBuyButton() {
        Button buyButton = dialog.findViewById(R.id.trade_b_buy);
        buyButton.setOnClickListener(v1 -> {
            this.actionListener.onStockBuy(stocks);
        });
    }

    public void initializeSellButton() {
        Button sellButton = dialog.findViewById(R.id.trade_b_sell);
        sellButton.setOnClickListener(v1 -> {
            this.actionListener.onStockSell(stocks);
        });
    }
}