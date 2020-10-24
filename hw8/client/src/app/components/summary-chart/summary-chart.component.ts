import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { AlertManager } from 'src/app/models/alert-manager';
import { ApiResponse } from 'src/app/models/api-response';
import { ApiStatus } from 'src/app/models/api-status';
import { ChartItem } from 'src/app/models/chart-item';

@Component({
  selector: 'app-summary-chart',
  templateUrl: './summary-chart.component.html',
  styleUrls: ['./summary-chart.component.scss']
})
export class SummaryChartComponent implements OnInit, OnChanges {
  @Input() ticker: string;
  @Input() change: number;
  @Input() items: ChartItem[];
  apiStatus = new ApiStatus();
  alertManager = new AlertManager();
  Highcharts = Highcharts;
  chartConstructor = 'stockChart';
  chartOptions: Highcharts.Options = {};
  // windowResizeEventListener: () => void = null;
  // chartCallback: Highcharts.ChartCallbackFunction = this.addWindowResizeEventListener.bind(this);
  updateFlag = false;

  constructor() { }

  // addWindowResizeEventListener(chart): void {
  //   this.windowResizeEventListener = () => chart.reflow();
  //   window.addEventListener('resize', this.windowResizeEventListener);
  //   chart.reflow();
  // }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.alertManager.removeAllAlerts();
    const items: ChartItem[] = changes.items.currentValue;
    if (items.length === 0) {
      const errorMessage = 'No chart data available.';
      this.alertManager.addWarningAlert(errorMessage, false);
      this.apiStatus.error(errorMessage);
    } else {
      this.setChartOptions();
      this.apiStatus.success();
      this.updateFlag = true;
    }
  }

  // ngOnDestroy(): void {
  //   if (this.windowResizeEventListener) {
  //     window.removeEventListener('resize', this.windowResizeEventListener);
  //   }
  // }

  getColor(): string {
    let color = 'black';
    if (this.change > 0) {
      color = '#33a745';
    } else if (this.change < 0) {
      color = '#dc3545';
    }
    return color;
  }

  getChartData(): any[] {
    return this.items.map(item => [item.date, item.close]);
  }

  setChartOptions(): void {
    this.chartOptions = {
      title: {
        text: this.ticker,
        style: {
          color: '#687380',
        }
      },

      xAxis: {
        type: 'datetime',
        minRange: 4 * 60 * 1000,
        minTickInterval: 4 * 60 * 1000,
        startOnTick: true,
        endOnTick: true
      },

      chart: {
        spacingTop: 0,
        spacingLeft: 0,
        spacingRight: 0
      },

      responsive: {
        rules: [{
          condition: {
            maxWidth: 1400
          },
          chartOptions: {
            legend: {
              enabled: false
            }
          }
        }]
      },

      rangeSelector: {
        enabled: false
      },

      navigator: {
        series: {
          color: this.getColor(),
          fillOpacity: 1
        }
      },

      series: [{
        name: this.ticker,
        type: 'line',
        color: this.getColor(),
        data: this.getChartData(),
        tooltip: {
          valueDecimals: 2
        },
        pointPlacement: 'on'
      }]
    };
  }
}
