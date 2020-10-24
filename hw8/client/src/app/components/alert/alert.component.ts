import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Alert } from 'src/app/models/alert';

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

  ngOnInit(): void {
    if (this.alert.dismissible) {
      this.setTimer();
    }
  }

  ngOnDestroy(): void {
    if (this.alert.dismissible && this.timer) {
      this.clearTimer();
    }
  }

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

  getClass(): string {
    const classes = ['alert'];
    if (this.alert.dismissible) {
      classes.push('alert-dismissible');
    }
    classes.push(`alert-${this.alert.type}`);
    classes.push('text-center');
    return classes.join(' ');
  }
}
