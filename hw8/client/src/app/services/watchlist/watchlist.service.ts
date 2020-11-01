import { Injectable } from '@angular/core';
import { WatchlistItem } from 'src/app/models/watchlist-item';

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
    this.addToWatchlist(watchlist, WatchlistItem.with(ticker, name, price));
    this.storeWatchlist(watchlist);
  }

  private addToWatchlist(watchlist: WatchlistItem[], item: WatchlistItem): void {
    watchlist.push(item);
    watchlist.sort((item1, item2) => {
      const ticker1 = item1.ticker;
      const ticker2 = item2.ticker;
      if (ticker1 < ticker2) {
        return -1;
      }
      if (ticker1 > ticker2) {
        return 1;
      }
      return 0;
    });
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
    return (JSON.parse(localStorage.getItem('watchlist')) || []).map(item => WatchlistItem.from(item));
  }

  private storeWatchlist(watchlist: WatchlistItem[]): void {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }
}
