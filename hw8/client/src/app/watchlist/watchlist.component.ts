import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { WatchlistItem, WatchlistService } from '../watchlist.service';
import { StockService } from '../stock.service';
import { ApiStatus } from '../api-status';
import { AlertManager } from '../alert-manager';
import { Alert } from '../alert';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {
  successWatchlist: WatchlistItem[] = [];
  alertManager: AlertManager = new AlertManager();
  apiStatus = new ApiStatus();

  constructor(private stockService: StockService, public watchlistService: WatchlistService, private router: Router) { }

  private getWatchlistData(): void {
    const watchlist = this.watchlistService.getWatchlist();
    forkJoin(watchlist.map(item =>
      this.stockService.getLastPrice(item.ticker)
        .pipe(
          tap(() => {
            if (this.apiStatus.isInitial()) {
              this.apiStatus.loading();
            }
          }),
          catchError(error => of(null))
        )
    )).subscribe(lastPrices => {
      const successWatchlist: WatchlistItem[] = [];
      const errorTickers: string[] = [];
      for (let i = 0; i < watchlist.length; i++) {
        const item = watchlist[i];
        const lastPrice = lastPrices[i];
        if (lastPrice === null) {
          errorTickers.push(item.ticker);
        } else {
          item.lastPrice = lastPrice;
          item.change = +((item.price - lastPrice).toFixed(2));
          item.changePercent = +(((item.price - lastPrice) / 100).toFixed(2));
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
    this.successWatchlist = this.successWatchlist.filter(item => item.ticker !== ticker);
    this.watchlistService.remove(ticker);
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

  ngOnInit(): void {
    if (this.watchlistService.isWatchlistEmpty()) {
      this.showEmptyWatchlistAlert();
      this.apiStatus.success();
    } else {
      this.getWatchlistData();
    }
  }
}
