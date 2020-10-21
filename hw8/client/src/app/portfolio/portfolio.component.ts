import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PortfolioService } from '../portfolio.service';
import { PortfolioItem } from '../portfolio-item';
import { StockService } from '../stock.service';
import { ApiStatus } from '../api-status';
import { AlertManager } from '../alert-manager';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit, OnDestroy {
  successPortfolio: PortfolioItem[] = [];
  lastPrices = {};
  alertManager: AlertManager = new AlertManager();
  apiStatus = new ApiStatus();
  subscription: Subscription = null;

  constructor(
    private stockService: StockService,
    public portfolioService: PortfolioService,
    private router: Router,
    public modal: NgbModal,
    modalConfig: NgbModalConfig
  ) {
    modalConfig.keyboard = false;
    modalConfig.beforeDismiss = () => false;
  }

  ngOnInit(): void {
    if (this.portfolioService.isPortfolioEmpty()) {
      this.showEmptyPortfolioAlert();
      this.apiStatus.success();
    } else {
      this.getPortfolioData();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private getPortfolioData(): void {
    const portfolio = this.portfolioService.getPortfolio();
    this.apiStatus.loading();
    this.subscription = forkJoin(
      portfolio.map(item =>
        this.stockService.getLastPrice(item.ticker).pipe(catchError(_ => of(null)))
      )
    ).subscribe(lastPrices => {
      const successPortfolio: PortfolioItem[] = [];
      const errorTickers: string[] = [];
      for (let i = 0; i < portfolio.length; i++) {
        const item = portfolio[i];
        const ticker = item.ticker;
        const lastPrice = lastPrices[i];
        if (lastPrice === null) {
          errorTickers.push(ticker);
        } else {
          this.lastPrices[ticker] = lastPrice;
          successPortfolio.push(item);
        }
      }
      let message = null;
      if (errorTickers.length > 0) {
        message = `Error occurred while fetching last prices of stock(s): ${errorTickers.join(', ')}.`;
        this.alertManager.addDangerAlert(message, false);
      }
      if (successPortfolio.length === 0) {
        this.apiStatus.error(message);
      } else {
        this.successPortfolio = successPortfolio;
        this.apiStatus.success();
      }
    });
  }

  navigateToDetails(ticker): void {
    this.router.navigate(['/details', ticker]);
  }

  showEmptyPortfolioAlert(): void {
    this.alertManager.addWarningAlert('Currently you don\'t have any stock in your portfolio.', false);
  }

  openBuyModal(item: PortfolioItem): void {
    const modalRef = this.modal.open(ModalComponent);
    modalRef.componentInstance.buttonText = 'Buy';
    modalRef.componentInstance.ticker = item.ticker;
    modalRef.componentInstance.currentPrice = this.lastPrices[item.ticker];
    modalRef.result.then((quantity) => {
      if (quantity) {
        this.buy(item, quantity);
      }
    });
  }

  buy(item: PortfolioItem, quantity: number): void {
    this.portfolioService.buy(item.ticker, item.name, quantity, this.lastPrices[item.ticker]);
    this.successPortfolio = this.portfolioService.getFilteredPortfolio(this.getSuccessTickers());
  }

  openSellModal(item: PortfolioItem): void {
    const modalRef = this.modal.open(ModalComponent);
    modalRef.componentInstance.buttonText = 'Sell';
    modalRef.componentInstance.ticker = item.ticker;
    modalRef.componentInstance.currentPrice = this.lastPrices[item.ticker];
    modalRef.componentInstance.maxQuantity = item.quantity;
    modalRef.result.then((quantity) => {
      if (quantity) {
        this.sell(item, quantity);
      }
    });
  }

  sell(item: PortfolioItem, quantity: number): void {
    this.portfolioService.sell(item.ticker, quantity);
    this.successPortfolio = this.portfolioService.getFilteredPortfolio(this.getSuccessTickers());
    if (this.portfolioService.isPortfolioEmpty()) {
      this.showEmptyPortfolioAlert();
    }
  }

  getSuccessTickers(): string[] {
    return this.successPortfolio.map(item => item.ticker);
  }
}
