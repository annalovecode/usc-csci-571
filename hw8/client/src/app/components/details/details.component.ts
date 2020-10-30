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
import { BuySellModalComponent } from 'src/app/components/buy-sell-modal/buy-sell-modal.component';
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

  historicalChartApiStatus = new ApiStatus();
  historicalChartAlertManager = new AlertManager();
  historicalChartOptions: Highcharts.Options = null;
  private historicalChartSubscription: Subscription = null;

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
      this.fetchHistoricalChartData();
    });
  }

  ngOnDestroy(): void {
    this.cancelSubscription();
    if (this.historicalChartSubscription) {
      this.historicalChartSubscription.unsubscribe();
    }
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
      const errorMessage = `No results found. Please enter valid Ticker`;
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
    const modalRef = this.modal.open(BuySellModalComponent);
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

  fetchHistoricalChartData(): void {
    this.historicalChartApiStatus.loading();
    this.historicalChartSubscription = this.stockService.getHistoricalChartData(this.ticker)
      .subscribe((response: ApiResponse<ChartItem[]>) => {
        if (response.isFailure()) {
          const error = response.error;
          if (error.isNotFound()) {
            this.historicalChartAlertManager.addWarningAlert('No chart data available.', false);
          } else {
            this.historicalChartAlertManager.addDangerAlert('Error occurred while fetching chart data.', false);
          }
          this.historicalChartApiStatus.error(error.message);
        } else {
          this.setHistoricalChartOptions(response.data);
          this.historicalChartApiStatus.success();
        }
      });
  }

  setHistoricalChartOptions(items: ChartItem[]): void {
    const ohlc = [];
    const volume = [];
    items.forEach(item => {
      ohlc.push([item.date, item.open, item.high, item.low, item.close]);
      volume.push([item.date, item.volume]);
    });

    this.historicalChartOptions = {
      title: {
        text: `${this.ticker} Historical`
      },

      subtitle: {
        text: '<div style="margin-top: 10px;">With SMA and Volume by Price technical indicators</div>',
        useHTML: true
      },

      rangeSelector: {
        selected: 2
      },
      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],

      tooltip: {
        split: true
      },

      plotOptions: {
        series: {
          dataGrouping: {
            units: [[
              'week',
              [1]
            ], [
              'month',
              [1, 2, 3, 4, 6]
            ]]
          }
        }
      },

      series: [{
        type: 'candlestick',
        name: this.ticker,
        id: this.ticker.toLowerCase(),
        zIndex: 2,
        data: ohlc
      }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: volume,
        yAxis: 1
      }, {
        type: 'vbp',
        linkedTo: this.ticker.toLowerCase(),
        params: {
          volumeSeriesID: 'volume'
        },
        dataLabels: {
          enabled: false
        },
        zoneLines: {
          enabled: false
        }
      }, {
        type: 'sma',
        linkedTo: this.ticker.toLowerCase(),
        zIndex: 1,
        marker: {
          enabled: false
        }
      }]
    };
  }
}
