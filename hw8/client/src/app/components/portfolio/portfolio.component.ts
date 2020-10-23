import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subscription } from 'rxjs';
import { PortfolioService } from '../../services/portfolio/portfolio.service';
import { PortfolioItem } from '../../models/portfolio-item';
import { StockService } from '../../services/stock/stock.service';
import { ApiStatus } from '../../models/api-status';
import { AlertManager } from '../../models/alert-manager';
import { ModalComponent } from '../modal/modal.component';
import { ApiResponse } from 'src/app/models/api-response';

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
    this.fetchLastPricesAndBuildPortfolio();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private fetchLastPricesAndBuildPortfolio(refetching = false): void {
    if (refetching) {
      this.successPortfolio = [];
      this.lastPrices = {};
      this.alertManager.clear();
    }
    if (this.portfolioService.isPortfolioEmpty()) {
      this.showEmptyPortfolioAlert();
      this.apiStatus.success();
      return;
    }
    this.apiStatus.loading();
    const portfolio = this.portfolioService.getPortfolio();
    this.subscription = forkJoin(portfolio.map(item => this.stockService.getLastPrice(item.ticker)))
      .subscribe((responses: ApiResponse<number>[]) => {
        const successPortfolio: PortfolioItem[] = [];
        const errorTickers: string[] = [];
        for (let i = 0; i < portfolio.length; i++) {
          const item = portfolio[i];
          const ticker = item.ticker;
          const response = responses[i];
          if (response.isFailure()) {
            errorTickers.push(ticker);
          } else {
            this.lastPrices[ticker] = response.data;
            successPortfolio.push(item);
          }
        }
        let errorMessage: string = null;
        if (errorTickers.length > 0) {
          errorMessage =
            `Error occurred while ${refetching ? 'refetching' : 'fetching'} last prices of stock(s): ${errorTickers.join(', ')}.`;
          this.alertManager.addDangerAlert(errorMessage, false);
        }
        if (successPortfolio.length === 0) {
          this.apiStatus.error(errorMessage);
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
    this.fetchLastPricesAndBuildPortfolio(true);
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
    this.fetchLastPricesAndBuildPortfolio(true);
  }
}
