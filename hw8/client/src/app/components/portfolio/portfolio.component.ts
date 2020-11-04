import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subscription } from 'rxjs';
import { PortfolioService } from 'src/app/services/portfolio/portfolio.service';
import { PortfolioItem } from 'src/app/models/portfolio-item';
import { StockService } from 'src/app/services/stock/stock.service';
import { ApiStatus } from 'src/app/models/api-status';
import { AlertManager } from 'src/app/models/alert-manager';
import { BuySellModalComponent } from 'src/app/components/buy-sell-modal/buy-sell-modal.component';
import { ApiResponse } from 'src/app/models/api-response';
import { LastPrices } from 'src/app/models/last-prices';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit, OnDestroy {
  portfolio: PortfolioItem[] = null;
  lastPrices = null;
  alertManager: AlertManager = new AlertManager();
  apiStatus = new ApiStatus();
  subscription: Subscription = null;

  constructor(
    private stockService: StockService,
    public portfolioService: PortfolioService,
    private router: Router,
    public modal: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.fetchPortfolioAndLastPrices();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private fetchPortfolioAndLastPrices(refetching = false): void {
    if (this.portfolioService.isPortfolioEmpty()) {
      this.addPortfolioEmptyAlert();
      this.apiStatus.error();
    } else {
      if (!refetching) {
        this.apiStatus.loading();
      }
      const portfolio = this.portfolioService.getPortfolio();
      this.subscription = this.stockService.getLastPrices(portfolio.map(item => item.ticker))
        .subscribe((response: ApiResponse<LastPrices>) => {
          if (response.isFailure()) {
            this.alertManager.addDangerAlert(
              `Error occurred while ${refetching ? 'refetching' : 'fetching'} last prices of stocks.`,
              false
            );
            this.apiStatus.error();
          } else {
            this.portfolio = portfolio;
            this.lastPrices = response.data;
            this.apiStatus.success();
          }
        });
    }
  }

  navigateToDetails(ticker): void {
    this.router.navigate(['/details', ticker]);
  }

  addPortfolioEmptyAlert(): void {
    this.alertManager.addWarningAlert('Currently you don\'t have any stock.', false);
  }

  openBuyModal(item: PortfolioItem): void {
    const modalRef = this.modal.open(BuySellModalComponent);
    modalRef.componentInstance.buttonText = 'Buy';
    modalRef.componentInstance.ticker = item.ticker;
    modalRef.componentInstance.currentPrice = this.lastPrices[item.ticker];
    modalRef.result.then((quantity) => {
      if (quantity) {
        this.buy(item, quantity);
      }
    }).catch(_ => { });
  }

  buy(item: PortfolioItem, quantity: number): void {
    this.portfolioService.buy(item.ticker, item.name, quantity, this.lastPrices[item.ticker]);
    this.fetchPortfolioAndLastPrices(true);
  }

  openSellModal(item: PortfolioItem): void {
    const modalRef = this.modal.open(BuySellModalComponent);
    modalRef.componentInstance.buttonText = 'Sell';
    modalRef.componentInstance.ticker = item.ticker;
    modalRef.componentInstance.currentPrice = this.lastPrices[item.ticker];
    modalRef.componentInstance.maxQuantity = item.quantity;
    modalRef.result.then((quantity) => {
      if (quantity) {
        this.sell(item, quantity);
      }
    }).catch(_ => { });
  }

  sell(item: PortfolioItem, quantity: number): void {
    this.portfolioService.sell(item.ticker, quantity);
    this.fetchPortfolioAndLastPrices(true);
  }
}
