import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, timer, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { StockService } from '../stock.service';
import { WatchlistService } from '../watchlist.service';
import ApiStatus from '../api-status';

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

  constructor(private activatedRoute: ActivatedRoute, private stockService: StockService, public watchlistService: WatchlistService) { }

  getDetails(): void {
    this.subscription = timer(0, 1000000).pipe(
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
