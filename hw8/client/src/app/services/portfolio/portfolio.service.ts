import { Injectable } from '@angular/core';
import { PortfolioItem } from '../../models/portfolio-item';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  constructor() {
    this.init();
  }

  private init(): void {
    const portfolio = this.fetchPortfolio();
    this.storePortfolio(portfolio);
  }

  getPortfolio(): PortfolioItem[] {
    return this.fetchPortfolio();
  }

  getFilteredPortfolio(tickers: string[]): PortfolioItem[] {
    const portfolio = this.fetchPortfolio();
    return portfolio.filter(item => tickers.includes(item.ticker));
  }

  buy(ticker: string, name: string, quantity: number, price: number): void {
    const portfolio = this.fetchPortfolio();
    const existingItem = portfolio.find(item => item.ticker === ticker);
    if (existingItem) {
      existingItem.buy(quantity, price);
    } else {
      this.addToPortfolio(portfolio, PortfolioItem.of(ticker, name, quantity, price));
    }
    this.storePortfolio(portfolio);
  }

  private addToPortfolio(portfolio: PortfolioItem[], item: PortfolioItem): void {
    portfolio.push(item);
    portfolio.sort((item1, item2) => {
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

  sell(ticker: string, quantity: number): void {
    let portfolio = this.fetchPortfolio();
    const existingItem = portfolio.find(item => item.ticker === ticker);
    if (existingItem.sell(quantity)) {
      portfolio = portfolio.filter(item => item.ticker !== ticker);
    }
    this.storePortfolio(portfolio);
  }

  isPortfolioEmpty(): boolean {
    return this.fetchPortfolio().length === 0;
  }

  private fetchPortfolio(): PortfolioItem[] {
    return (JSON.parse(localStorage.getItem('portfolio')) || []).map(item => PortfolioItem.clone(item));
  }

  private storePortfolio(portfolio: PortfolioItem[]): void {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }
}
