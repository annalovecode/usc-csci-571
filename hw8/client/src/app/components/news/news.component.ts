import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NewsModalComponent } from '../news-modal/news-modal.component';
import { AlertManager } from '../../models/alert-manager';
import { ApiStatus } from '../../models/api-status';
import { NewsItem } from '../../models/news-item';
import { StockService } from '../../services/stock/stock.service';
import { ApiResponse } from 'src/app/models/api-response';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, OnDestroy {
  @Input() ticker: string = null;
  items: NewsItem[] = [];
  apiStatus = new ApiStatus();
  subscription: Subscription = null;
  alertManager: AlertManager = new AlertManager();

  constructor(private stockService: StockService, public modal: NgbModal) {
  }

  ngOnInit(): void {
    this.fetchNews();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchNews(): void {
    this.apiStatus.loading();
    this.subscription = this.stockService.getNews(this.ticker).subscribe((response: ApiResponse<NewsItem[]>) => {
      if (response.isFailure()) {
        const error = response.error;
        if (error.isClientOrNetwork()) {
          this.alertManager.addDangerAlert('Network error occurred while fetching news.', false);
        } else if (error.isNotFound()) {
          this.alertManager.addWarningAlert('No news available.', false);
        } else if (error.isServiceUnavailable()) {
          this.alertManager.addDangerAlert('News API error occurred while fetching news.', false);
        } else {
          this.alertManager.addDangerAlert('Unknown server error occurred while fetching news.', false);
        }
        this.apiStatus.error(error);
      } else {
        this.items = response.data;
        this.apiStatus.success();
      }
    });
  }

  openModal(item: NewsItem): void {
    const modalRef = this.modal.open(NewsModalComponent);
    modalRef.componentInstance.item = item;
    modalRef.result.then(_ => { }).catch(_ => { });
  }
}
