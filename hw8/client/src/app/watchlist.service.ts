import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  constructor() {
    this.init();
  }

  init(): void {
    const watchlist = this.fetch();
    this.store(watchlist);
  }

  get(): string[] {
    return this.fetch();
  }

  add(ticker: string): void {
    const watchlist = this.fetch();
    watchlist.push(ticker);
    this.store(watchlist);
  }

  remove(ticker: string): void {
    const watchlist = this.fetch();
    this.store(watchlist.filter(watchlisted => watchlisted !== ticker));
  }

  isWatchlisted(ticker: string): boolean {
    const watchlist = this.fetch();
    return watchlist.includes(ticker);
  }

  private fetch(): string[] {
    try {
      const watchlist = JSON.parse(localStorage.getItem('watchlist'));
      return watchlist || [];
    } catch (error) {
      return [];
    }
  }

  private store(watchlist: string[]): void {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }
}
