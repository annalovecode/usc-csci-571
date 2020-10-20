import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SearchResult } from './search-result';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  constructor(private http: HttpClient) { }

  get<T>(resource: string, params: { [key: string]: string } = {}): any {
    // TODO: Use relative paths
    const url = `api/${resource}`;
    const options = {
      params,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.get<T>(url, options);
  }

  search(query: string): Observable<SearchResult[]> {
    return this.get<SearchResult[]>('search', { query })
      .pipe(
        map((response: { [key: string]: any }) => response.data),
        catchError(this.handleError('search'))
      );
  }

  getDetails(ticker: string): Observable<SearchResult[]> {
    return this.get<SearchResult[]>(`details/${ticker}`)
      .pipe(
        map((response: { [key: string]: any }) => response.data),
        catchError(this.handleError('getDetails'))
      );
  }

  getLastPrice(ticker: string): Observable<number> {
    return this.get<number>(`last-price/${ticker}`)
      .pipe(
        map((response: { [key: string]: any }) => response.data),
        catchError(this.handleError('getLastPrice'))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError(operation = 'operation'): (error: HttpErrorResponse) => Observable<never> {
    return (error: HttpErrorResponse) => {
      console.log(error);
      let errorMessage: string;
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        errorMessage = 'Unknown error';
        console.log('Client or network error:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        if (error.error.message) {
          errorMessage = error.error.message;
          console.log(`Backend error: ${errorMessage}`);
        } else {
          errorMessage = 'Unknown error';
        }
      }
      this.log(`${operation} failed: ${errorMessage}`);
      // Return an observable with a user-facing error message.
      return throwError(errorMessage);
    };
  }

  private log(message: string): void {
    console.log(`Stock Service: ${message}`);
  }
}
