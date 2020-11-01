import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { WatchlistService } from 'src/app/services/watchlist/watchlist.service';
import { WatchlistItem } from 'src/app/models/watchlist-item';
import { StockService } from 'src/app/services/stock/stock.service';
import { ApiStatus } from 'src/app/models/api-status';
import { AlertManager } from 'src/app/models/alert-manager';
import { Alert } from 'src/app/models/alert';
import { ApiResponse } from 'src/app/models/api-response';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit, OnDestroy {
  successWatchlist: WatchlistItem[] = [];
  lastPrices = {};
  alertManager: AlertManager = new AlertManager();
  apiStatus = new ApiStatus();
  subscription: Subscription = null;

  constructor(private stockService: StockService, public watchlistService: WatchlistService, private router: Router) { }

  ngOnInit(): void {
    this.fetchLastPricesAndBuildWatchlist();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private fetchLastPricesAndBuildWatchlist(refetching = false): void {
    if (refetching) {
      this.successWatchlist = [];
      this.lastPrices = {};
      this.alertManager.removeAllAlerts();
    }
    if (this.watchlistService.isWatchlistEmpty()) {
      this.showEmptyWatchlistAlert();
      this.apiStatus.success();
      return;
    }
    this.apiStatus.loading();
    const watchlist = this.watchlistService.getWatchlist();
    this.subscription = forkJoin(watchlist.map(item => this.stockService.getLastPrice(item.ticker)))
      .subscribe((responses: ApiResponse<number>[]) => {
        const successWatchlist: WatchlistItem[] = [];
        const errorTickers: string[] = [];
        for (let i = 0; i < watchlist.length; i++) {
          const item = watchlist[i];
          const ticker = item.ticker;
          const response = responses[i];
          if (response.isFailure()) {
            errorTickers.push(ticker);
          } else {
            this.lastPrices[ticker] = response.data;
            successWatchlist.push(item);
          }
        }
        let errorMessage: string = null;
        if (errorTickers.length > 0) {
          errorMessage = `Error occurred while ${refetching ? 'refetching' : 'fetching'} last prices of stock(s): ${errorTickers.join(', ')}.`;
          this.alertManager.addDangerAlert(errorMessage, false);
        }
        if (successWatchlist.length === 0) {
          this.apiStatus.error(errorMessage);
        } else {
          this.successWatchlist = successWatchlist;
          this.apiStatus.success();
        }
      });
  }

  removeFromWatchlist(ticker: string): void {
    this.watchlistService.remove(ticker);
    this.fetchLastPricesAndBuildWatchlist(true);
  }

  navigateToDetails(ticker): void {
    this.router.navigate(['/details', ticker]);
  }

  removeAlert(alert: Alert): void {
    this.alertManager.removeAlert(alert);
  }

  showEmptyWatchlistAlert(): void {
    this.alertManager.addWarningAlert('Currently you don\'t have any stock in your watchlist.', false);
  }
}
