package com.rochakgupta.stocktrading.detail.portfolio;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.widget.Button;
import android.widget.TextView;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.detail.Info;
import com.rochakgupta.stocktrading.format.FormattingUtils;
import com.rochakgupta.stocktrading.main.portfolio.PortfolioItem;
import com.rochakgupta.stocktrading.storage.Storage;
import com.rochakgupta.stocktrading.toast.ToastManager;

public class PortfolioManager implements TradeDialog.SuccessListener {
    private final TextView stocksView;

    private final TextView marketPriceView;

    private final TradeDialog tradeDialog;

    private final Info info;

    public PortfolioManager(Activity activity, ToastManager toastManager, Info info) {
        stocksView = activity.findViewById(R.id.detail_tv_portfolio_stocks);
        marketPriceView = activity.findViewById(R.id.detail_tv_portfolio_market_value);
        tradeDialog = new TradeDialog(activity, toastManager, info, this);
        Button tradeButton = activity.findViewById(R.id.detail_b_portfolio_trade);
        tradeButton.setOnClickListener(v -> {
            tradeDialog.show();
        });
        this.info = info;
    }

    @SuppressLint("SetTextI18n")
    public void display() {
        String stocksText = null;
        String marketPriceText = null;
        String ticker = info.getTicker();
        if (Storage.isPresentInPortfolio(ticker)) {
            PortfolioItem item = Storage.getPortfolioItem(ticker);
            stocksText = String.format("Shares owned: %s", FormattingUtils.getQuantityString(item.getStocks()));
            item.setLastPrice(info.getLastPrice());
            marketPriceText = String
                    .format("Market Value: %s", FormattingUtils.getPriceString(item.getTotalLastPrice()));
        } else {
            stocksText = String.format("You have 0 shares of %s.", ticker);
            marketPriceText = "Start trading!";
        }
        stocksView.setText(stocksText);
        marketPriceView.setText(marketPriceText);
    }

    @Override
    public void onTradeSuccess() {
        display();
    }
}
