package com.rochakgupta.stocktrading.detail.news;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.detail.NewsItem;

import java.util.List;

public class NewsAdapter extends RecyclerView.Adapter<NewsAdapterViewHolder> {

    private static final int VIEW_TYPE_BIG = 0;

    private static final int VIEW_TYPE_SMALL = 1;

    private final Context context;

    private final List<NewsItem> items;

    private final NewsAdapterOnClickHandler clickHandler;

    public interface NewsAdapterOnClickHandler {
        void onNewsClick(NewsItem item);

        void onNewsLongClick(NewsItem item);
    }

    public NewsAdapter(Context context, List<NewsItem> items, NewsAdapterOnClickHandler clickHandler) {
        this.context = context;
        this.items = items;
        this.clickHandler = clickHandler;
    }

    @NonNull
    @Override
    public NewsAdapterViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        int layoutId;
        switch (viewType) {
            case VIEW_TYPE_BIG: {
                layoutId = R.layout.news_item_big;
                break;
            }
            case VIEW_TYPE_SMALL: {
                layoutId = R.layout.news_item_small;
                break;
            }
            default:
                throw new IllegalArgumentException("Invalid view type, value of " + viewType);
        }
        View view = LayoutInflater.from(context).inflate(layoutId, parent, false);
        view.setFocusable(true);
        return new NewsAdapterViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull NewsAdapterViewHolder holder, int position) {
        NewsItem item = items.get(position);
        ImageLoader.loadRounded(context, holder.imageView, item.getUrlToImage());
        holder.publisherView.setText(item.getPublisher());
        holder.publishedAtView.setText(item.getPublishedAt());
        holder.titleView.setText(item.getTitle());
        holder.itemView.setOnClickListener(v -> clickHandler.onNewsClick(item));
        holder.itemView.setOnLongClickListener(v -> {
            clickHandler.onNewsLongClick(item);
            return true;
        });
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    @Override
    public int getItemViewType(int position) {
        return position == 0 ? VIEW_TYPE_BIG : VIEW_TYPE_SMALL;
    }
}
