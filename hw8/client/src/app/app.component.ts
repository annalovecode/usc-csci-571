import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  searchLink = { id: 'search', title: 'Search', path: '' };

  links = [
    this.searchLink,
    { id: 'watchlist', title: 'Watchlist', path: 'watchlist' },
    { id: 'portfolio', title: 'Portfolio', path: 'portfolio' }
  ];

  isNavbarCollapsed = true;

  activeLink: string = null;

  constructor(private router: Router) {
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  closeNavbar(activeLink): void {
    this.activeLink = activeLink;
    this.isNavbarCollapsed = true;
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof RoutesRecognized) {
        const route = event.state.root.firstChild;
        const id = route.data.id;
        if (id === 'details') {
          this.activeLink = null;
        } else if (this.activeLink !== id) {
          this.activeLink = id;
        }
      }
    });
  }
}
