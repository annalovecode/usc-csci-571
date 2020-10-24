import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-buy-sell-modal',
  templateUrl: './buy-sell-modal.component.html',
  styleUrls: ['./buy-sell-modal.component.scss']
})
export class BuySellModalComponent implements OnInit {
  @Input() buttonText: string;
  @Input() maxQuantity = Infinity;
  @Input() ticker: string;
  @Input() currentPrice: number;
  quantity = 0;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  close(): void {
    this.activeModal.close(null);
  }

  submit(): void {
    this.activeModal.close(this.quantity);
  }

  isButtonDisabled(): boolean {
    return this.quantity < 1 || this.quantity > this.maxQuantity;
  }

  getTotal(): number {
    return +((this.quantity * this.currentPrice).toFixed(2));
  }
}
