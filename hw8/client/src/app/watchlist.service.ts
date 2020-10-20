import { Injectable } from '@angular/core';

export interface WatchlistItem {
  ticker: string;
  name: string;
  price: number;
  lastPrice?: number;
  change?: number;
  changePercent?: number;
}

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

  add(ticker: string, name: string, price: number): void {
    const watchlist = this.fetchWatchlist();
    watchlist.push({
      ticker, name, price
    });
    this.storeWatchlist(watchlist);
  }

  remove(ticker: string): void {
    const watchlist = this.fetchWatchlist();
    this.storeWatchlist(watchlist.filter(item => item.ticker !== ticker));
  }

  isWatchlisted(ticker: string): boolean {
    const watchlist = this.fetchWatchlist();
    return watchlist.some(item => item.ticker === ticker);
  }

  isWatchlistEmpty(): boolean {
    return this.fetchWatchlist().length === 0;
  }

  private fetchWatchlist(): WatchlistItem[] {
    return JSON.parse(localStorage.getItem('watchlist')) || [];
  }

  private storeWatchlist(watchlist: WatchlistItem[]): void {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }
}
