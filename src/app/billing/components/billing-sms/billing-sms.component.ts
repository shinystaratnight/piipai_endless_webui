import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { BillingService } from '../../services/billing-service';
import { autoChargeMetadata } from './billing-sms.metadata.ts';

@Component({
  selector: 'app-billing-sms',
  templateUrl: './billing-sms.component.html',
  styleUrls: ['./billing-sms.component.scss']
})
export class BillingSmsComponent implements OnInit, OnDestroy {

  public smsBalance: any;
  public amount = 20;
  public modalConfig = autoChargeMetadata;
  public modalRef: NgbModalRef;
  public group: FormGroup;
  public additionalData: any;

  @ViewChild('charge') public modal;
  @ViewChild('funds') public fundsModal;

  constructor(
    private billingService: BillingService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getSmsBalance();
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public getSmsBalance() {
    this.billingService.getCreditDetails().subscribe(
      (res: any) => {
        this.smsBalance = res.sms_balance;
      }
    );
  }

  public showAddFundsForm() {
    this.openModal(this.fundsModal);
  }

  public addFunds() {
    this.billingService.addFunds({ amount: this.amount }).subscribe(
      (res: any) => {
        this.amount = 20;
        this.modalRef.close();
        this.getSmsBalance();
      }
    );
  }

  public autoCharge() {
    this.group = new FormGroup({});
    this.modalConfig.forEach((el) => {
      el.value = this.smsBalance[el.key];
    });
    this.openModal(this.modal);
  }

  public openModal(modal) {
    this.modalRef = this.modalService.open(modal);
  }

  public saveAutoCharge() {
    this.billingService.setCreditDetails(this.group.value)
      .subscribe((res: any) => {
        this.smsBalance = res.sms_balance;
        this.modalRef.close();
      });
  }
}
