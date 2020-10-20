import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Alert } from '../alert';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  isOpen = true;
  @Input() alert: Alert;
  @Output() closed = new EventEmitter();
  private timer = null;

  constructor() { }

  close(): void {
    this.isOpen = false;
    this.clearTimer();
    this.closed.emit(this.alert);
  }

  setTimer(): void {
    this.timer = setTimeout(() => {
      this.close();
    }, 5000);
  }

  clearTimer(): void {
    clearTimeout(this.timer);
    this.timer = null;
  }

  ngOnInit(): void {
    this.setTimer();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      this.clearTimer();
    }
  }
}
