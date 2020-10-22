import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { StockService } from '../../services/stock/stock.service';
import { WatchlistService } from '../../services/watchlist/watchlist.service';
import { PortfolioService } from '../../services/portfolio/portfolio.service';
import { ApiStatus } from '../../models/api-status';
import { Details } from '../../models/details';
import { AlertManager } from '../../models/alert-manager';
import { Alert } from '../../models/alert';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  private ticker: string = null;
  apiStatus = new ApiStatus();
  details: Details = null;
  private subscription: Subscription = null;
  private refetching = false;
  alertManager: AlertManager = new AlertManager();

  constructor(
    private activatedRoute: ActivatedRoute,
    private stockService: StockService,
    private watchlistService: WatchlistService,
    private portfolioService: PortfolioService,
    public modal: NgbModal,
    modalConfig: NgbModalConfig
  ) {
    modalConfig.keyboard = false;
    modalConfig.beforeDismiss = () => false;
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.ticker = paramMap.get('ticker');
      this.getDetails();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getDetails(): void {
    this.apiStatus.loading();
    this.subscription = timer(0, 15000).pipe(
      switchMap(() => {
        return this.stockService.getDetails(this.ticker)
          .pipe(
            catchError(error => {
              if (!this.refetching) {
                this.apiStatus.error(error);
              }
              return of(null);
            })
          );
      })
    ).subscribe(data => {
      if (!this.refetching) {
        if (data === null) {
          this.alertManager.addDangerAlert(`Error occurred while fetching data.`, false);
        } else {
          this.details = data;
          this.apiStatus.success();
        }
        this.refetching = true;
      } else {
        if (data === null) {
          this.alertManager.addDangerAlert(`Error occurred while refetching data.`);
        } else {
          this.details = data;
        }
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
    });
  }

  buy(quantity: number): void {
    this.portfolioService.buy(this.ticker, this.details.name, quantity, this.details.lastPrice);
    this.alertManager.addSuccessAlert(`${this.ticker} bought successfully!`);
  }

  removeAlert(alert: Alert): void {
    this.alertManager.removeAlert(alert);
  }
}
