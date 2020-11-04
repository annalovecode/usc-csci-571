import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WatchlistService } from 'src/app/services/watchlist/watchlist.service';
import { WatchlistItem } from 'src/app/models/watchlist-item';
import { StockService } from 'src/app/services/stock/stock.service';
import { ApiStatus } from 'src/app/models/api-status';
import { AlertManager } from 'src/app/models/alert-manager';
import { Alert } from 'src/app/models/alert';
import { ApiResponse } from 'src/app/models/api-response';
import { LastPrices } from 'src/app/models/last-prices';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit, OnDestroy {
  watchlist: WatchlistItem[] = null;
  lastPrices: LastPrices = null;
  alertManager: AlertManager = new AlertManager();
  apiStatus = new ApiStatus();
  subscription: Subscription = null;

  constructor(private stockService: StockService, public watchlistService: WatchlistService, private router: Router) { }

  ngOnInit(): void {
    this.fetchWatchlistAndLastPrices();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private fetchWatchlistAndLastPrices(refetching = false): void {
    if (this.watchlistService.isWatchlistEmpty()) {
      this.addWatchlistEmptyAlert();
      this.apiStatus.error();
    } else {
      if (!refetching) {
        this.apiStatus.loading();
      }
      const watchlist = this.watchlistService.getWatchlist();
      this.subscription = this.stockService.getLastPrices(watchlist.map(item => item.ticker))
        .subscribe((response: ApiResponse<LastPrices>) => {
          if (response.isFailure()) {
            this.alertManager.addDangerAlert(
              `Error occurred while ${refetching ? 'refetching' : 'fetching'} last prices of stocks.`,
              false
            );
            this.apiStatus.error();
          } else {
            this.watchlist = watchlist;
            this.lastPrices = response.data;
            this.apiStatus.success();
          }
        });
    }
  }

  removeFromWatchlist(ticker: string): void {
    this.watchlistService.remove(ticker);
    this.fetchWatchlistAndLastPrices(true);
  }

  navigateToDetails(ticker): void {
    this.router.navigate(['/details', ticker]);
  }

  removeAlert(alert: Alert): void {
    this.alertManager.removeAlert(alert);
  }

  addWatchlistEmptyAlert(): void {
    this.alertManager.addWarningAlert('Currently you don\'t have any stock in your watchlist.', false);
  }
}
