import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StockService } from 'src/app/services/stock/stock.service';
import { WatchlistService } from 'src/app/services/watchlist/watchlist.service';
import { PortfolioService } from 'src/app/services/portfolio/portfolio.service';
import { ApiStatus } from 'src/app/models/api-status';
import { Details } from 'src/app/models/details';
import { AlertManager } from 'src/app/models/alert-manager';
import { Alert } from 'src/app/models/alert';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { ApiResponse } from 'src/app/models/api-response';
import { ChartItem } from 'src/app/models/chart-item';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  ticker: string = null;
  apiStatus = new ApiStatus();
  details: Details = null;
  summaryChartItems: ChartItem[] = [];
  private subscription: Subscription = null;
  alertManager: AlertManager = new AlertManager();

  constructor(
    private activatedRoute: ActivatedRoute,
    private stockService: StockService,
    private watchlistService: WatchlistService,
    private portfolioService: PortfolioService,
    public modal: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.ticker = paramMap.get('ticker');
      this.fetchDetails();
    });
  }

  ngOnDestroy(): void {
    this.cancelSubscription();
  }

  cancelSubscription(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  handleFetch(detailsResponse: ApiResponse<Details>, summaryChartResponse: ApiResponse<ChartItem[]>): void {
    if (detailsResponse.isSuccess() && summaryChartResponse.isSuccess()) {
      this.details = detailsResponse.data;
      this.summaryChartItems = summaryChartResponse.data;
      this.apiStatus.success();
    } else if (detailsResponse.isFailure() && detailsResponse.error.isNotFound()) {
      const errorMessage = `No results found. Please enter a valid Ticker`;
      this.alertManager.addDangerAlert(errorMessage, false);
      this.apiStatus.error(errorMessage);
      this.cancelSubscription();
    } else {
      const errorMessage = `Error occurred while fetching details and summary.`;
      this.alertManager.addDangerAlert(errorMessage, false);
      this.apiStatus.error(errorMessage);
    }
  }

  handleRefetch(detailsResponse: ApiResponse<Details>, summaryChartResponse: ApiResponse<ChartItem[]>): void {
    this.alertManager.removeFixedAlerts();
    if (detailsResponse.isSuccess() && summaryChartResponse.isSuccess()) {
      this.details = detailsResponse.data;
      this.summaryChartItems = summaryChartResponse.data;
      this.apiStatus.success();
    } else {
      this.alertManager.addDangerAlert(`Error occurred while refetching details and summary.`, false);
    }
  }

  fetchDetails(): void {
    this.apiStatus.loading();
    this.subscription = timer(0, 15000).pipe(
      switchMap(() => forkJoin([
        this.stockService.getDetails(this.ticker),
        this.stockService.getSummaryChartData(this.ticker)
      ]))).subscribe(([detailsResponse, summaryChartResponse]: [ApiResponse<Details>, ApiResponse<ChartItem[]>]) => {
        if (summaryChartResponse.isFailure() && summaryChartResponse.error.isNotFound()) {
          summaryChartResponse = ApiResponse.success<ChartItem[]>([]);
        }
        if (this.apiStatus.isLoading()) {
          this.handleFetch(detailsResponse, summaryChartResponse);
        } else {
          this.handleRefetch(detailsResponse, summaryChartResponse);
        }
      });
  }

  isWatchlisted(): boolean {
    return this.watchlistService.isWatchlisted(this.ticker);
  }

  addToWatchlist(): void {
    this.watchlistService.add(this.ticker, this.details.name, this.details.lastPrice);
    this.alertManager.addSuccessAlert(`${this.ticker} added to Watchlist.`);
  }

  removeFromWatchlist(): void {
    this.watchlistService.remove(this.ticker);
    this.alertManager.addDangerAlert(`${this.ticker} removed from Watchlist.`);
  }

  openModal(): void {
    const modalRef = this.modal.open(ModalComponent);
    modalRef.componentInstance.buttonText = 'Buy';
    modalRef.componentInstance.ticker = this.ticker;
    modalRef.componentInstance.currentPrice = this.details.lastPrice;
    modalRef.result.then((quantity) => {
      if (quantity) {
        this.buy(quantity);
      }
    }).catch(_ => { });
  }

  buy(quantity: number): void {
    this.portfolioService.buy(this.ticker, this.details.name, quantity, this.details.lastPrice);
    this.alertManager.addSuccessAlert(`${this.ticker} bought successfully!`);
  }

  removeAlert(alert: Alert): void {
    this.alertManager.removeAlert(alert);
  }
}
