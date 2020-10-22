import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WatchlistService } from '../../services/watchlist/watchlist.service';
import { WatchlistItem } from '../../models/watchlist-item';
import { StockService } from '../../services/stock/stock.service';
import { ApiStatus } from '../../models/api-status';
import { AlertManager } from '../../models/alert-manager';
import { Alert } from '../../models/alert';

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
    if (this.watchlistService.isWatchlistEmpty()) {
      this.showEmptyWatchlistAlert();
      this.apiStatus.success();
    } else {
      this.fetchLastPricesAndBuildWatchlist();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private fetchLastPricesAndBuildWatchlist(): void {
    const watchlist = this.watchlistService.getWatchlist();
    this.apiStatus.loading();
    this.subscription = forkJoin(
      watchlist.map(item =>
        this.stockService.getLastPrice(item.ticker).pipe(catchError(_ => of(null)))
      )
    ).subscribe(lastPrices => {
      const successWatchlist: WatchlistItem[] = [];
      const errorTickers: string[] = [];
      for (let i = 0; i < watchlist.length; i++) {
        const item = watchlist[i];
        const ticker = item.ticker;
        const lastPrice = lastPrices[i];
        if (lastPrice === null) {
          errorTickers.push(ticker);
        } else {
          this.lastPrices[ticker] = lastPrice;
          successWatchlist.push(item);
        }
      }
      let message = null;
      if (errorTickers.length > 0) {
        message = `Error occurred while fetching last prices of stock(s): ${errorTickers.join(', ')}.`;
        this.alertManager.addDangerAlert(message, false);
      }
      if (successWatchlist.length === 0) {
        this.apiStatus.error(message);
      } else {
        this.successWatchlist = successWatchlist;
        this.apiStatus.success();
      }
    });
  }

  removeFromWatchlist(ticker: string): void {
    this.watchlistService.remove(ticker);
    this.successWatchlist = this.watchlistService.getFilteredWatchlist(this.successWatchlist.map(item => item.ticker));
    if (this.watchlistService.isWatchlistEmpty()) {
      this.showEmptyWatchlistAlert();
    }
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
