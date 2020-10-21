import { Injectable } from '@angular/core';
import { WatchlistItem } from './watchlist-item';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  constructor() {
    this.init();
  }

  private init(): void {
    const watchlist = this.fetchWatchlist();
    this.storeWatchlist(watchlist);
  }

  getWatchlist(): WatchlistItem[] {
    return this.fetchWatchlist();
  }

  getFilteredWatchlist(tickers: string[]): WatchlistItem[] {
    const watchlist = this.fetchWatchlist();
    return watchlist.filter(item => tickers.includes(item.ticker));
  }

  add(ticker: string, name: string, price: number): void {
    const watchlist = this.fetchWatchlist();
    watchlist.push(WatchlistItem.of(ticker, name, price));
    this.storeWatchlist(watchlist);
  }

  remove(ticker: string): void {
    let watchlist = this.fetchWatchlist();
    watchlist = watchlist.filter(item => item.ticker !== ticker);
    this.storeWatchlist(watchlist);
  }

  isWatchlisted(ticker: string): boolean {
    const watchlist = this.fetchWatchlist();
    return watchlist.some(item => item.ticker === ticker);
  }

  isWatchlistEmpty(): boolean {
    return this.fetchWatchlist().length === 0;
  }

  private fetchWatchlist(): WatchlistItem[] {
    return (JSON.parse(localStorage.getItem('watchlist')) || []).map(item => WatchlistItem.clone(item));
  }

  private storeWatchlist(watchlist: WatchlistItem[]): void {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }
}
