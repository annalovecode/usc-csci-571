package com.rochakgupta.stocktrading.detail.news;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.detail.NewsItem;

import java.util.List;

public class NewsManager implements NewsAdapter.NewsAdapterOnClickHandler, NewsDialog.ActionListener {

    private final Context context;

    private final NewsDialog dialog;

    public NewsManager(Activity activity, Context context, List<NewsItem> news) {
        RecyclerView recyclerView = activity.findViewById(R.id.detail_rv_news);
        LinearLayoutManager layoutManager =
                new LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false);
        recyclerView.setLayoutManager(layoutManager);
        NewsAdapter adapter = new NewsAdapter(context, news, this);
        recyclerView.setAdapter(adapter);
        dialog = new NewsDialog(context, this);
        this.context = context;
    }

    @Override
    public void onNewsClick(NewsItem item) {
        view(item.getUrl());
    }

    @Override
    public void onNewsLongClick(NewsItem item) {
        dialog.show(item);
    }

    @Override
    public void onNewsShare(NewsItem item) {
        String url = getShareURL(item.getUrl());
        view(url);
    }

    @Override
    public void onNewsView(NewsItem item) {
        view(item.getUrl());
    }

    private String getShareURL(String url) {
        return (new Uri.Builder())
                .scheme("https")
                .encodedAuthority("twitter.com")
                .encodedPath("intent/tweet")
                .appendQueryParameter("text", "Check out this Link:")
                .appendQueryParameter("url", url)
                .appendQueryParameter("hashtags", "CSCI571StockApp")
                .build()
                .toString();
    }

    private void view(String url) {
        Uri uri = Uri.parse(url);
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        context.startActivity(intent);
    }
}
