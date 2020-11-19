package com.rochakgupta.stocktrading.detail.stats;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.GridView;

public class StatsGridView extends GridView {

    public StatsGridView(Context context) {
        super(context);
    }

    public StatsGridView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public StatsGridView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int heightSpec = heightMeasureSpec;
        if (getLayoutParams().height == LayoutParams.WRAP_CONTENT) {
            heightSpec = MeasureSpec.makeMeasureSpec(Integer.MAX_VALUE >> 2, MeasureSpec.AT_MOST);
        }
        super.onMeasure(widthMeasureSpec, heightSpec);
    }

}