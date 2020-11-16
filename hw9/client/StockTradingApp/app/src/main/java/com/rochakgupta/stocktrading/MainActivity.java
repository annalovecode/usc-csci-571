package com.rochakgupta.stocktrading;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.os.Handler;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.appcompat.widget.Toolbar;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;

public class MainActivity extends AppCompatActivity {
    private final String TAG = MainActivity.class.getSimpleName();

    private ProgressBar mProgressBar;
    private TextView mErrorView;

    private Timer mLastPricesFetchTimer;
    private RequestStatus mLastPricesFetchStatus;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.Theme_StockTradingApp);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initializeActionBar();

        mProgressBar = findViewById(R.id.pb);
        mErrorView = findViewById(R.id.tv_error);

        RequestUtils.initialize(this);

        mLastPricesFetchStatus = new RequestStatus();

        showProgressBar();
    }

    private void initializeActionBar() {
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayShowHomeEnabled(true);
        }
    }

    private void showProgressBar() {
        mProgressBar.setVisibility(View.VISIBLE);
        mErrorView.setVisibility(View.INVISIBLE);
    }

    private void showErrorView() {
        mProgressBar.setVisibility(View.INVISIBLE);
        mErrorView.setVisibility(View.VISIBLE);
    }

    private void startLastPricesFetchTimer() {
        Log.d(TAG, "Starting last prices fetch timer");
        mLastPricesFetchTimer = new Timer();
        mLastPricesFetchTimer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                RequestUtils.makeLastPricesFetchRequest(Collections.singletonList("AAPL"), response -> {
                    try {
                        JSONObject jsonData = response.getJSONObject("data");
                        ResponseUtils.logJSONObject(jsonData);
                        Map<String, Double> lastPrices = ResponseUtils.parseLastPrices(jsonData);
                        onLastPricesFetchSuccess(lastPrices);
                    } catch (JSONException e) {
                        e.printStackTrace();
                        onLastPricesFetchError();
                    }
                }, error -> {
                    ResponseUtils.logError(error);
                    onLastPricesFetchError();
                });
            }
        }, 0, TimeUnit.MINUTES.toMillis(15));
    }

    private void onLastPricesFetchSuccess(Map<String, Double> lastPrices) {
        if (!mLastPricesFetchStatus.isComplete()) {
            // First load
            showData();
        } else {
//            updateData();
        }
        mLastPricesFetchStatus.success();
    }

    private void showData() {
        mProgressBar.setVisibility(View.INVISIBLE);
        mErrorView.setVisibility(View.INVISIBLE);
    }

    private void onLastPricesFetchError() {
        if (!mLastPricesFetchStatus.isComplete()) {
            // First load
            showErrorView();
            mLastPricesFetchStatus.error();
        } else {
            Toast.makeText(
                    this, "Error occurred while refetching last prices", Toast.LENGTH_SHORT).show();
        }
    }

    private void stopLastPricesFetchTimer() {
        Log.d(TAG, "Stopping last prices fetch timer");
        mLastPricesFetchTimer.cancel();
        RequestUtils.cancelRequests(RequestUtils.LAST_PRICES_FETCH_REQUEST_TAG);
    }

    @Override
    protected void onResume() {
        super.onResume();
        startLastPricesFetchTimer();
    }

    @Override
    protected void onPause() {
        super.onPause();
        stopLastPricesFetchTimer();
        cancelSearchOptionsFetchRequests();
    }

    @SuppressLint("RestrictedApi")
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);

        MenuItem searchMenu = menu.findItem(R.id.action_search);

        SearchView searchView = (SearchView) searchMenu.getActionView();

        final SearchView.SearchAutoComplete searchAutoComplete =
                searchView.findViewById(androidx.appcompat.R.id.search_src_text);

        SearchAdapter adapter = new SearchAdapter(
                this,
                android.R.layout.simple_dropdown_item_1line);

        searchAutoComplete.setAdapter(adapter);
        searchAutoComplete.setThreshold(3);

        int TRIGGER_AUTO_COMPLETE = 7;

        Handler handler = new Handler(message -> {
            if (message.what == TRIGGER_AUTO_COMPLETE) {
                String query = searchAutoComplete.getText().toString();
                if (!TextUtils.isEmpty(query)) {
                    RequestUtils.makeSearchOptionsFetchRequest(query, response -> {
                        try {
                            JSONArray jsonData = response.getJSONArray("data");
                            ResponseUtils.logJSONArray(jsonData);
                            List<SearchOption> searchOptions = ResponseUtils.parseSearchOptions(jsonData);
                            adapter.setData(SearchOption.getFormattedOptions(searchOptions));
                            adapter.notifyDataSetChanged();
                        } catch (JSONException e) {
                            e.printStackTrace();
                            onSearchOptionsRequestFailure(null, adapter);
                        }
                    }, error -> {
                        ResponseUtils.logError(error);
                        String errorMessage = null;
                        if (ResponseUtils.isNotFoundError(error)) {
                            errorMessage = "No search options found";
                        }
                        onSearchOptionsRequestFailure(errorMessage, adapter);
                    });
                }
            }
            return false;
        });

        searchAutoComplete.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int
                    count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before,
                                      int count) {
                cancelSearchOptionsFetchRequests();
                handler.removeMessages(TRIGGER_AUTO_COMPLETE);
                handler.sendEmptyMessageDelayed(TRIGGER_AUTO_COMPLETE, 300);
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        searchAutoComplete.setOnItemClickListener((adapterView, view, itemIndex, id) -> {
            String formattedSearchOption = (String) adapterView.getItemAtPosition(itemIndex);
            Log.d(TAG, formattedSearchOption);
            // Launch detail activity
        });

        return super.onCreateOptionsMenu(menu);
    }

    private void onSearchOptionsRequestFailure(String message, SearchAdapter adapter) {
        adapter.clear();
        adapter.notifyDataSetChanged();
        if (message == null) {
            message = "Error occurred while fetching search options";
        }
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    private void cancelSearchOptionsFetchRequests() {
        RequestUtils.cancelRequests(RequestUtils.SEARCH_OPTIONS_FETCH_REQUEST_TAG);
    }
}