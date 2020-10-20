import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, timer, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { StockService } from '../stock.service';
import { WatchlistService } from '../watchlist.service';
import { ApiStatus } from '../api-status';
import { Alert } from '../alert';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  private ticker: string = null;
  apiStatus = new ApiStatus();
  private details = null;
  private subscription: Subscription = null;
  alerts: Alert[] = [];

  constructor(private activatedRoute: ActivatedRoute, private stockService: StockService, private watchlistService: WatchlistService) { }

  getDetails(): void {
    this.subscription = timer(0, 15000).pipe(
      tap(() => this.apiStatus.loading()),
      switchMap(() => {
        return this.stockService.getDetails(this.ticker)
          .pipe(
            catchError(error => {
              this.apiStatus.error(error);
              return of(null);
            })
          );
      })
    ).subscribe(data => {
      if (data !== null) {
        this.details = data;
        this.apiStatus.success();
      }
    });
  }

  isWatchlisted(): boolean {
    return this.watchlistService.isWatchlisted(this.ticker);
  }

  addToWatchlist(): void {
    this.watchlistService.add(this.ticker);
    this.addAlert('success', `${this.ticker} added to Watchlist.`);
  }

  removeFromWatchlist(): void {
    this.watchlistService.remove(this.ticker);
    this.addAlert('danger', `${this.ticker} removed from Watchlist.`);
  }

  addAlert(type: string, message: string): void {
    this.alerts.unshift({
      type,
      message
    });
  }

  removeAlert(alert: Alert): void {
    this.alerts = this.alerts.filter(existingAlert => existingAlert !== alert);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.ticker = paramMap.get('ticker');
      this.getDetails();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
