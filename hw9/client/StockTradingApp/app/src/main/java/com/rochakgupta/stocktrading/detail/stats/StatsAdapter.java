package com.rochakgupta.stocktrading.detail.stats;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.rochakgupta.stocktrading.R;

import java.util.List;

public class StatsAdapter extends BaseAdapter {
    private final Context context;
    private final List<Stat> stats;

    public StatsAdapter(Context context, List<Stat> stats) {
        this.context = context;
        this.stats = stats;
    }

    @Override
    public int getCount() {
        return stats.size();
    }

    @Override
    public Stat getItem(int position) {
        return stats.get(position);
    }

    @Override
    public long getItemId(int position) {
        return 0;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        Stat stat = getItem(position);

        if (convertView == null) {
            final LayoutInflater layoutInflater = LayoutInflater.from(context);
            convertView = layoutInflater.inflate(R.layout.stat, null);
        }

        TextView view = convertView.findViewById(R.id.detail_tv_stat);
        view.setText(stat.getFormattedStat());
        return view;
    }
}
