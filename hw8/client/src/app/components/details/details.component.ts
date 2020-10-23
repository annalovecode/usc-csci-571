import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StockService } from '../../services/stock/stock.service';
import { WatchlistService } from '../../services/watchlist/watchlist.service';
import { PortfolioService } from '../../services/portfolio/portfolio.service';
import { ApiStatus } from '../../models/api-status';
import { Details } from '../../models/details';
import { AlertManager } from '../../models/alert-manager';
import { Alert } from '../../models/alert';
import { ModalComponent } from '../../components/modal/modal.component';
import { ApiResponse } from 'src/app/models/api-response';

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
    private router: Router,
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchDetails(): void {
    this.apiStatus.loading();
    this.subscription = timer(0, 1005000).pipe(switchMap(() => this.stockService.getDetails(this.ticker)))
      .subscribe((response: ApiResponse<Details>) => {
        if (response.isFailure()) {
          const error = response.error;
          if (error.isClientOrNetwork()) {
            this.alertManager.addDangerAlert(
              `Network error occurred while ${this.refetching ? 'refetching' : 'fetching'} details.`,
              this.refetching
            );
          } else if (error.isNotFound()) {
            this.router.navigate(['/']);
          } else if (error.isServiceUnavailable()) {
            this.alertManager.addDangerAlert(
              `Tiingo API error occurred while ${this.refetching ? 'refetching' : 'fetching'} details.`,
              this.refetching
            );
          } else {
            this.alertManager.addDangerAlert(
              `Unknown server error occurred while ${this.refetching ? 'refetching' : 'fetching'} details.`,
              this.refetching
            );
          }
          if (!this.refetching) {
            this.apiStatus.error(response.error.message);
          }
        } else {
          this.details = response.data;
          if (!this.refetching) {
            this.apiStatus.success();
          }
        }
        if (!this.refetching) {
          this.refetching = true;
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
