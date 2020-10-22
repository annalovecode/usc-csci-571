import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of, Subject, Subscription } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged, tap, catchError } from 'rxjs/operators';
import { ApiStatus } from '../../models/api-status';
import { StockService } from '../../services/stock/stock.service';
import { SearchResult } from '../../models/search-result';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  private inputs = new Subject<string>();
  apiStatus = new ApiStatus();
  options: SearchResult[] = [];
  private ticker: string = null;
  private subscription: Subscription = null;

  constructor(private stockService: StockService, private router: Router) {
  }

  ngOnInit(): void {
    this.subscription = this.inputs.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.apiStatus.loading()),
      switchMap(input => {
        if (input) {
          return this.stockService.search(input as string)
            .pipe(
              catchError(error => {
                this.apiStatus.error(error);
                return of(null);
              })
            );
        } else {
          return of([]);
        }
      })
    ).subscribe(data => {
      if (data !== null) {
        this.options = data;
        if (data.length === 0) {
          this.apiStatus.error('No results');
        } else {
          this.apiStatus.success();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  changeInput(input: string): void {
    this.inputs.next(input.trim());
    this.ticker = null;
  }

  selectOption(ticker: string): void {
    this.ticker = ticker || null;
  }

  navigateToDetails(): void {
    if (this.ticker) {
      this.router.navigate(['/details', this.ticker]);
    }
  }
}
