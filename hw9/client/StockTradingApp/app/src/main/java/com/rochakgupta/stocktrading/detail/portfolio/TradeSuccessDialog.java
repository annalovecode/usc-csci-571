package com.rochakgupta.stocktrading.detail.portfolio;

import android.app.Dialog;
import android.content.Context;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.format.FormattingUtils;

public class TradeSuccessDialog {
    private final String ticker;

    private final Dialog dialog;

    private final TextView messageView;

    public TradeSuccessDialog(Context context, String ticker) {
        dialog = new Dialog(context);
        dialog.setContentView(R.layout.trade_success_dialog);

        messageView = dialog.findViewById(R.id.trade_tv_message);
        Button button = dialog.findViewById(R.id.trade_b_done);
        button.setOnClickListener(v -> dialog.dismiss());

        Window window = dialog.getWindow();
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);

        this.ticker = ticker;
    }

    public void show(TradeType tradeType, int stocks) {
        String tradeString = tradeType.equals(TradeType.BUY) ? "bought" : "sold";
        String stocksString = FormattingUtils.getQuantityString(stocks);
        String sharesString = stocks < 2 ? "share" : "shares";
        messageView.setText(String.format(
                "You have successfully %s %s %s of %s", tradeString, stocksString, sharesString, ticker));
        dialog.show();
    }
}
