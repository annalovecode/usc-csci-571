import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertManager } from '../alert-manager';
import { ApiStatus } from '../api-status';
import { NewsItem } from '../news-item';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, OnDestroy {
  @Input() ticker: string = null;
  newsItems: NewsItem[] = [];
  apiStatus = new ApiStatus();
  subscription: Subscription = null;
  alertManager: AlertManager = new AlertManager();

  constructor(private stockService: StockService) { }

  getNews(): void {
    this.apiStatus.loading();
    this.subscription = this.stockService.getNews(this.ticker).pipe(
      catchError(error => {
        this.apiStatus.error(error);
        this.alertManager.addDangerAlert('Error occurred while fetching news.', false);
        return of(null);
      })
    ).subscribe(data => {
      if (data !== null) {
        this.newsItems = data;
        this.apiStatus.success();
      }
    });
  }

  ngOnInit(): void {
    this.getNews();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
