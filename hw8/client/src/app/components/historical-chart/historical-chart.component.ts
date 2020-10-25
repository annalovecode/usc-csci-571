import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as Highcharts from 'highcharts/highstock';
import IndicatorsCore from 'highcharts/indicators/indicators';
import vbp from 'highcharts/indicators/volume-by-price';
import { AlertManager } from 'src/app/models/alert-manager';
import { ApiResponse } from 'src/app/models/api-response';
import { ApiStatus } from 'src/app/models/api-status';
import { ChartItem } from 'src/app/models/chart-item';
import { StockService } from 'src/app/services/stock/stock.service';

IndicatorsCore(Highcharts);
vbp(Highcharts);

@Component({
  selector: 'app-historical-chart',
  templateUrl: './historical-chart.component.html',
  styleUrls: ['./historical-chart.component.scss']
})
export class HistoricalChartComponent implements OnInit, OnDestroy {
  @Input() ticker;
  apiStatus = new ApiStatus();
  alertManager = new AlertManager();
  items: ChartItem[] = [];
  subscription: Subscription = null;
  Highcharts = Highcharts;
  chartConstructor = 'stockChart';
  chartOptions: Highcharts.Options;

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchData(): void {
    this.apiStatus.loading();
    this.subscription = this.stockService.getHistoricalChartData(this.ticker).subscribe((response: ApiResponse<ChartItem[]>) => {
      if (response.isFailure()) {
        const error = response.error;
        if (error.isNotFound()) {
          this.alertManager.addWarningAlert('No chart data available.', false);
        } else {
          this.alertManager.addDangerAlert('Error occurred while fetching chart data.', false);
        }
        this.apiStatus.error(error.message);
      } else {
        this.items = response.data;
        this.setChartOptions();
        this.apiStatus.success();
      }
    });
  }

  setChartOptions(): void {
    const ohlc = [];
    const volume = [];
    this.items.forEach(item => {
      ohlc.push([item.date, item.open, item.high, item.low, item.close]);
      volume.push([item.date, item.volume]);
    });

    this.chartOptions = {
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
