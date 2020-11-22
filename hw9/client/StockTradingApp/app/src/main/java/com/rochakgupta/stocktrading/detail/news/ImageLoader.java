package com.rochakgupta.stocktrading.detail.news;

import android.content.Context;
import android.widget.ImageView;

import com.squareup.picasso.Picasso;

import jp.wasabeef.picasso.transformations.RoundedCornersTransformation;

public class ImageLoader {
    public static void load(Context context, ImageView imageView, String url) {
        Picasso.with(context)
               .load(url)
               .fit()
               .into(imageView);
    }

    public static void loadRounded(Context context, ImageView imageView, String url) {
        Picasso.with(context)
               .load(url)
               .transform(new RoundedCornersTransformation(40, 0))
               .fit()
               .into(imageView);
    }
}
