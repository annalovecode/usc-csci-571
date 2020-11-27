package com.rochakgupta.stocktrading.main.section.common;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.RecyclerView;

import com.rochakgupta.stocktrading.R;
import com.rochakgupta.stocktrading.main.section.favorites.FavoritesItemViewHolder;

public abstract class SectionTouchCallback extends ItemTouchHelper.Callback {

    Context context;

    private final Paint clearPaint;

    private final ColorDrawable background;

    private final int backgroundColor;

    private final Drawable deleteDrawable;

    private final int intrinsicWidth;

    private final int intrinsicHeight;

    public SectionTouchCallback(Context context) {
        this.context = context;
        background = new ColorDrawable();
        backgroundColor = Color.parseColor("#b80f0a");
        clearPaint = new Paint();
        clearPaint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.CLEAR));
        deleteDrawable = ContextCompat.getDrawable(context, R.drawable.ic_baseline_delete_24);
        intrinsicWidth = deleteDrawable.getIntrinsicWidth();
        intrinsicHeight = deleteDrawable.getIntrinsicHeight();
    }

    @Override
    public boolean isLongPressDragEnabled() {
        return true;
    }

    @Override
    public boolean isItemViewSwipeEnabled() {
        return true;
    }

    @Override
    public int getMovementFlags(@NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder) {
        int dragFlags = isSectionViewHolder(viewHolder) ? ItemTouchHelper.UP | ItemTouchHelper.DOWN : 0;
        int swipeFlags = isFavoritesViewHolder(viewHolder) ? ItemTouchHelper.START : 0;
        return makeMovementFlags(dragFlags, swipeFlags);
    }

    @Override
    public boolean onMove(@NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder,
                          @NonNull RecyclerView.ViewHolder target) {
        onItemMove(viewHolder, viewHolder.getAdapterPosition(), target.getAdapterPosition());
        return true;
    }

    @Override
    public void onChildDraw(@NonNull Canvas c, @NonNull RecyclerView recyclerView,
                            @NonNull RecyclerView.ViewHolder viewHolder, float dX, float dY, int actionState,
                            boolean isCurrentlyActive) {
        super.onChildDraw(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive);

        View itemView = viewHolder.itemView;
        int itemHeight = itemView.getHeight();

        boolean isCancelled = dX == 0 && !isCurrentlyActive;

        if (isCancelled) {
            clearCanvas(
                    c, itemView.getRight() + dX, (float) itemView.getTop(), (float) itemView.getRight(),
                    (float) itemView.getBottom());
            super.onChildDraw(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive);
            return;
        }

        background.setColor(backgroundColor);
        background.setBounds(itemView.getRight() + (int) dX, itemView.getTop(), itemView.getRight(),
                             itemView.getBottom());
        background.draw(c);

        int deleteIconTop = itemView.getTop() + (itemHeight - intrinsicHeight) / 2;
        int deleteIconMargin = (itemHeight - intrinsicHeight) / 2;
        int deleteIconLeft = itemView.getRight() - deleteIconMargin - intrinsicWidth;
        int deleteIconRight = itemView.getRight() - deleteIconMargin;
        int deleteIconBottom = deleteIconTop + intrinsicHeight;


        deleteDrawable.setBounds(deleteIconLeft, deleteIconTop, deleteIconRight, deleteIconBottom);
        deleteDrawable.draw(c);

        super.onChildDraw(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive);
    }

    private void clearCanvas(Canvas c, Float left, Float top, Float right, Float bottom) {
        c.drawRect(left, top, right, bottom, clearPaint);
    }

    @Override
    public float getSwipeThreshold(@NonNull RecyclerView.ViewHolder viewHolder) {
        return 0.7f;
    }

    @Override
    public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
        if (isFavoritesViewHolder(viewHolder)) {
            FavoritesItemViewHolder holder = (FavoritesItemViewHolder) viewHolder;
            onFavoriteItemSwipe(holder);
        }
    }

    @Override
    public void onSelectedChanged(@Nullable RecyclerView.ViewHolder viewHolder, int actionState) {
        if (actionState != ItemTouchHelper.ACTION_STATE_IDLE && isSectionViewHolder(viewHolder)) {
            viewHolder.itemView.setBackgroundColor(context.getColor(R.color.darkGray));
        }
        super.onSelectedChanged(viewHolder, actionState);
    }

    @Override
    public void clearView(@NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder) {
        super.clearView(recyclerView, viewHolder);
        if (isSectionViewHolder(viewHolder)) {
            viewHolder.itemView.setBackgroundColor(context.getColor(R.color.white));
        }
    }

    public abstract void onFavoriteItemSwipe(RecyclerView.ViewHolder viewHolder);

    public abstract void onItemMove(RecyclerView.ViewHolder viewHolder, int fromPosition, int toPosition);

    private boolean isSectionViewHolder(RecyclerView.ViewHolder viewHolder) {
        return viewHolder instanceof SectionViewHolder;
    }

    public boolean isFavoritesViewHolder(RecyclerView.ViewHolder viewHolder) {
        if (!isSectionViewHolder(viewHolder)) {
            return false;
        }
        SectionViewHolder holder = (SectionViewHolder) viewHolder;
        return holder.getType().equals(SectionViewHolderType.FAVORITES);
    }
}
