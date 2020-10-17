import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  searchLink = { id: 'search', title: 'Search', path: '' };

  links = [
    this.searchLink,
    { id: 'watchlist', title: 'Watchlist', path: 'watchlist' },
    { id: 'portfolio', title: 'Portfolio', path: 'portfolio' }
  ];

  isNavbarCollapsed = true;

  activeLink = 'search';

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  closeNavbar(activeLink): void {
    this.activeLink = activeLink;
    this.isNavbarCollapsed = true;
  }
}
