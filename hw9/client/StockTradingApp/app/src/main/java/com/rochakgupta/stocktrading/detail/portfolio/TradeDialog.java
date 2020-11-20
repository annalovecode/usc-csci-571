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
import com.rochakgupta.stocktrading.main.portfolio.PortfolioItem;
import com.rochakgupta.stocktrading.storage.Storage;
import com.rochakgupta.stocktrading.toast.ToastManager;

public class TradeDialog {
    private final Dialog dialog;

    private final EditText stocksEditText;

    private final TextView stocksPriceView;

    private final ToastManager toastManager;

    private final SuccessListener successListener;

    private final Info info;

    private int stocks;

    interface SuccessListener {
        void onTradeSuccess();
    }

    public TradeDialog(Context context, ToastManager toastManager, Info info, SuccessListener successListener) {
        dialog = new Dialog(context);
        dialog.setContentView(R.layout.trade_dialog);

        stocksEditText = dialog.findViewById(R.id.trade_et_stocks);
        stocksPriceView = dialog.findViewById(R.id.trade_tv_stocks_price);

        Window window = dialog.getWindow();
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);

        this.toastManager = toastManager;

        this.info = info;

        this.successListener = successListener;

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
        String stocksPriceString = FormattingUtils.getPriceStringWithSymbol(getStocksPrice());
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
            buy();
        });
    }

    public void initializeSellButton() {
        Button sellButton = dialog.findViewById(R.id.trade_b_sell);
        sellButton.setOnClickListener(v1 -> {
            sell();
        });
    }

    private void buy() {
        if (stocks == 0) {
            toastManager.show("Cannot buy less than 0 shares");
        } else {
            double balance = Storage.getBalance();
            double stocksPrice = getStocksPrice();
            if (stocksPrice > balance) {
                toastManager.show("Not enough money to buy");
            } else {
                Storage.updateBalance(balance - stocksPrice);
                Storage.addToPortfolio(info.getTicker(), stocks, info.getLastPrice());
                dialog.dismiss();
                this.successListener.onTradeSuccess();
            }
        }
    }

    private void sell() {
        if (stocks == 0) {
            toastManager.show("Cannot sell less than 0 shares");
        } else {
            String ticker = info.getTicker();
            Integer portfolioStocks = null;
            if (Storage.isPresentInPortfolio(ticker)) {
                PortfolioItem item = Storage.getPortfolioItem(ticker);
                portfolioStocks = item.getStocks();
            } else {
                portfolioStocks = 0;
            }
            if (stocks > portfolioStocks) {
                toastManager.show("Not enough shares to sell");
            } else {
                Storage.updateBalance(Storage.getBalance() + getStocksPrice());
                Storage.removeFromPortfolio(ticker, stocks);
                dialog.dismiss();
                this.successListener.onTradeSuccess();
            }
        }
    }

    private double getStocksPrice() {
        return stocks * info.getLastPrice();
    }
}