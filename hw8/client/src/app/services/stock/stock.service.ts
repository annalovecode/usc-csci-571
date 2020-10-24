import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SearchResult } from 'src/app/models/search-result';
import { Details } from 'src/app/models/details';
import { NewsItem } from 'src/app/models/news-item';
import { ChartItem } from 'src/app/models/chart-item';
import { ApiError } from 'src/app/models/api-error';
import { ApiResponse } from 'src/app/models/api-response';

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

  getDetails(ticker: string): Observable<ApiResponse<Details>> {
    return this.get<SearchResult[]>(`details/${ticker}`)
      .pipe(
        map((response: { [key: string]: any }) => ApiResponse.success<Details>(response.data)),
        catchError(this.handleError<Details>('getDetails'))
      );
  }

  getLastPrice(ticker: string): Observable<ApiResponse<number>> {
    return this.get<number>(`last-price/${ticker}`)
      .pipe(
        map((response: { [key: string]: any }) => ApiResponse.success<number>(response.data)),
        catchError(this.handleError<number>('getLastPrice'))
      );
  }

  getNews(ticker: string): Observable<ApiResponse<NewsItem[]>> {
    return this.get<NewsItem[]>(`news/${ticker}`)
      .pipe(
        map((response: { [key: string]: any }) => ApiResponse.success<NewsItem[]>(response.data)),
        catchError(this.handleError<NewsItem[]>('getNews'))
      );
  }

  getSummaryChartData(ticker: string): Observable<ApiResponse<ChartItem[]>> {
    return this.get<ChartItem[]>(`summary-chart/${ticker}`)
      .pipe(
        map((response: { [key: string]: any }) => ApiResponse.success<ChartItem[]>(response.data)),
        catchError(this.handleError<ChartItem[]>('getSummaryChartData'))
      );
  }

  private handleError<T>(operation = 'operation'): (error: HttpErrorResponse) => Observable<ApiResponse<T>> {
    return (error: HttpErrorResponse) => {
      console.log(error);
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
