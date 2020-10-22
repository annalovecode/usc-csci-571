import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NewsModalComponent } from '../news-modal/news-modal.component';
import { AlertManager } from '../../models/alert-manager';
import { ApiStatus } from '../../models/api-status';
import { NewsItem } from '../../models/news-item';
import { StockService } from '../../services/stock/stock.service';

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

  constructor(private stockService: StockService, public modal: NgbModal, modalConfig: NgbModalConfig) {
    modalConfig.keyboard = false;
    modalConfig.beforeDismiss = () => false;
  }

  ngOnInit(): void {
    this.fetchNews();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  fetchNews(): void {
    this.apiStatus.loading();
    this.subscription = this.stockService.getNews(this.ticker).pipe(
      catchError(error => {
        this.apiStatus.error(error);
        this.alertManager.addDangerAlert('Error occurred while fetching news.', false);
        return of(null);
      })
    ).subscribe(data => {
      if (data !== null) {
        this.items = data;
        this.apiStatus.success();
      }
    });
  }

  openModal(item: NewsItem): void {
    const modalRef = this.modal.open(NewsModalComponent);
    modalRef.componentInstance.item = item;
  }
}
