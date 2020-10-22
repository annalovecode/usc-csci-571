import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { DetailsComponent } from './components/details/details.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';

const routes: Routes = [
  { path: '', component: SearchComponent, data: { id: 'search' } },
  { path: 'details/:ticker', component: DetailsComponent, data: { id: 'details' } },
  { path: 'watchlist', component: WatchlistComponent, data: { id: 'watchlist' } },
  { path: 'portfolio', component: PortfolioComponent, data: { id: 'portfolio' } },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
