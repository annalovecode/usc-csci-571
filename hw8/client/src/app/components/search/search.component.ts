import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ApiStatus } from '../../models/api-status';
import { StockService } from '../../services/stock/stock.service';
import { SearchResult } from '../../models/search-result';
import { ApiResponse } from 'src/app/models/api-response';

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
      switchMap(input => this.stockService.search(input as string))
    ).subscribe((response: ApiResponse<SearchResult[]>) => {
      if (response.isFailure()) {
        const error = response.error;
        let errorMessage: string = null;
        if (error.isClientOrNetwork()) {
          errorMessage = 'Network error';
        } else if (error.isNotFound()) {
          errorMessage = 'No results';
        } else if (error.isServiceUnavailable()) {
          errorMessage = 'Tiingo API error';
        } else {
          errorMessage = 'Unknown server error';
        }
        this.apiStatus.error(errorMessage);
      } else {
        this.options = response.data;
        this.apiStatus.success();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  changeInput(input: string): void {
    input = input.trim();
    if (input) {
      this.inputs.next(input);
    }
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
