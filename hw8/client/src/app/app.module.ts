import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { HighchartsChartModule } from 'highcharts-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from 'src/app/components/app/app.component';
import { SearchComponent } from 'src/app/components/search/search.component';
import { WatchlistComponent } from 'src/app/components/watchlist/watchlist.component';
import { PortfolioComponent } from 'src/app/components/portfolio/portfolio.component';
import { DetailsComponent } from 'src/app/components/details/details.component';
import { StockService } from './services/stock/stock.service';
import { WatchlistService } from 'src/app/services/watchlist/watchlist.service';
import { PortfolioService } from 'src/app/services/portfolio/portfolio.service';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { BuySellModalComponent } from 'src/app/components/buy-sell-modal/buy-sell-modal.component';
import { NewsComponent } from 'src/app/components/news/news.component';
import { GroupPipe } from 'src/app/pipes/group/group.pipe';
import { NewsModalComponent } from 'src/app/components/news-modal/news-modal.component';
import { SummaryChartComponent } from 'src/app/components/summary-chart/summary-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    WatchlistComponent,
    PortfolioComponent,
    DetailsComponent,
    AlertComponent,
    BuySellModalComponent,
    NewsComponent,
    GroupPipe,
    NewsModalComponent,
    SummaryChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    HighchartsChartModule
  ],
  providers: [StockService, WatchlistService, PortfolioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
