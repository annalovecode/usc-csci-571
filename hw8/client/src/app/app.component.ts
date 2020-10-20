import { Component, OnInit } from '@angular/core';
import { Router, Event, RoutesRecognized } from '@angular/router';

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

  activeLinkId: string = null;

  constructor(private router: Router) {
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  closeNavbar(activeLinkId): void {
    this.activeLinkId = activeLinkId;
    this.isNavbarCollapsed = true;
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof RoutesRecognized) {
        const route = event.state.root.firstChild;
        const id = route.data.id;
        if (id === 'details') {
          this.activeLinkId = null;
        } else if (this.activeLinkId !== id) {
          this.activeLinkId = id;
        }
      }
    });
  }
}
