import { Component, OnInit } from '@angular/core';
import { of, Subject } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged, tap, catchError } from 'rxjs/operators';
import ApiStatus from '../api-status';
import { StockService } from '../stock.service';
import { SearchResult } from '../search-result';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  private inputs = new Subject<string>();
  apiStatus = new ApiStatus();
  options: SearchResult[] = [];
  ticker: string = null;

  constructor(private stockService: StockService) {
  }

  changeInput(input: string): void {
    this.inputs.next(input.trim());
    this.ticker = null;
  }

  selectOption(ticker: string): void {
    this.ticker = ticker || null;
  }

  ngOnInit(): void {
    this.inputs.pipe(
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
}
