package com.rochakgupta.stocktrading.main.search;

import android.content.Context;
import android.widget.ArrayAdapter;
import android.widget.Filter;
import android.widget.Filterable;

import java.util.ArrayList;
import java.util.List;

public class SearchAdapter extends ArrayAdapter<String> implements Filterable {
    private final List<String> items;

    public SearchAdapter(Context context, int resource) {
        super(context, resource);
        items = new ArrayList<>();
    }

    public void setItemsAndNotify(List<String> list) {
        items.clear();
        items.addAll(list);
        notifyDataSetChanged();
    }

    public void clearItemsAndNotify() {
        items.clear();
        notifyDataSetChanged();
    }

    @Override
    public int getCount() {
        return items.size();
    }

    @Override
    public String getItem(int position) {
        return items.get(position);
    }

    @Override
    public Filter getFilter() {
        return new Filter() {
            @Override
            protected FilterResults performFiltering(CharSequence constraint) {
                FilterResults filterResults = new FilterResults();
                if (constraint != null) {
                    filterResults.values = items;
                    filterResults.count = items.size();
                }
                return filterResults;
            }
            @Override
            protected void publishResults(CharSequence constraint, FilterResults results) {
                if (results != null && (results.count > 0)) {
                    notifyDataSetChanged();
                } else {
                    notifyDataSetInvalidated();
                }
            }
        };
    }
}
