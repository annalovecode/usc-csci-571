import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import IndicatorsCore from 'highcharts/indicators/indicators';
import vbp from 'highcharts/indicators/volume-by-price';
import { Alert } from 'src/app/models/alert';
import { AlertManager } from 'src/app/models/alert-manager';
import { ApiStatus } from 'src/app/models/api-status';

IndicatorsCore(Highcharts);
vbp(Highcharts);

@Component({
  selector: 'app-historical-chart',
  templateUrl: './historical-chart.component.html',
  styleUrls: ['./historical-chart.component.scss']
})
export class HistoricalChartComponent implements OnInit {
  @Input() apiStatus: ApiStatus;
  @Input() alertManager: AlertManager;
  Highcharts = Highcharts;
  chartConstructor = 'stockChart';
  @Input() chartOptions: Highcharts.Options;

  constructor() { }

  ngOnInit(): void {

  }

  removeAlert(alert: Alert): void {
    this.alertManager.removeAlert(alert);
  }
}
