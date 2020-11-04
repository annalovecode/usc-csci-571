import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SearchResult } from 'src/app/models/search-result';
import { DetailsAndSummary } from 'src/app/models/details-summary';
import { NewsItem } from 'src/app/models/news-item';
import { ChartItem } from 'src/app/models/chart-item';
import { ApiError } from 'src/app/models/api-error';
import { ApiResponse } from 'src/app/models/api-response';
import { LastPrices } from 'src/app/models/last-prices';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  constructor(private http: HttpClient) { }

  get<T>(resource: string, params: { [key: string]: any } = {}): any {
    const url = `api/${resource}`;
    const options = {
      params,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.get<T>(url, options);
  }

  search(query: string): Observable<ApiResponse<SearchResult[]>> {
    return this.get<SearchResult[]>('search', { query })
      .pipe(
        map((response: { [key: string]: any }) => ApiResponse.success<SearchResult[]>(response.data)),
        catchError(this.handleError<SearchResult[]>('search'))
      );
  }

  getDetailsAndSummary(ticker: string): Observable<ApiResponse<DetailsAndSummary>> {
    return this.get<SearchResult[]>(`details-summary/${ticker}`)
      .pipe(
        map((response: { [key: string]: any }) => ApiResponse.success<DetailsAndSummary>(response.data)),
        catchError(this.handleError<DetailsAndSummary>('getDetailsAndSummary'))
      );
  }

  getLastPrices(tickers: string[]): Observable<ApiResponse<LastPrices>> {
    return this.get<LastPrices>('last-price', { tickers: tickers.join(',') })
      .pipe(
        map((response: { [key: string]: any }) => ApiResponse.success<LastPrices>(response.data)),
        catchError(this.handleError<LastPrices>('getLastPrices'))
      );
  }

  getNews(ticker: string): Observable<ApiResponse<NewsItem[]>> {
    return this.get<NewsItem[]>(`news/${ticker}`)
      .pipe(
        map((response: { [key: string]: any }) => ApiResponse.success<NewsItem[]>(response.data)),
        catchError(this.handleError<NewsItem[]>('getNews'))
      );
  }

  getHistoricalChartData(ticker: string): Observable<ApiResponse<ChartItem[]>> {
    return this.get<ChartItem[]>(`historical-chart/${ticker}`)
      .pipe(
        map((response: { [key: string]: any }) => ApiResponse.success<ChartItem[]>(response.data)),
        catchError(this.handleError<ChartItem[]>('getHistoricalChartData'))
      );
  }

  private handleError<T>(operation = 'operation'): (error: HttpErrorResponse) => Observable<ApiResponse<T>> {
    return (error: HttpErrorResponse) => {
      let apiError: ApiError;
      if (error.error instanceof ErrorEvent || !(error.error.message)) {
        // A client-side or network error occurred. Handle it accordingly.
        apiError = ApiError.clientOrNetwork('Network error');
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        apiError = ApiError.backend(error.status, error.error.message);
      }
      this.log(`${operation} failed: ${apiError.message}`);
      // Return an observable with a user-facing error message.
      return of(ApiResponse.failure<T>(apiError));
    };
  }

  private log(message: string): void {
    console.log(`Stock Service: ${message}`);
  }
}
