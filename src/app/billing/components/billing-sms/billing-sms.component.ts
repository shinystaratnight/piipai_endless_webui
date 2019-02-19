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

  public isShowFundsForm: boolean;
  public smsBalance: any;
  public amount = 20;
  public modalConfig = autoChargeMetadata;
  public modalRef: NgbModalRef;
  public group: FormGroup;
  public additionalData: any;

  @ViewChild('charge') public modal;

  constructor(
    private billingService: BillingService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.billingService.getCreditDetails().subscribe(
      (res: any) => {
        this.smsBalance = res.sms_balance;
      }
    );
  }

  public ngOnDestroy() {

  }

  public showAddFundsForm() {
    this.isShowFundsForm = true;
  }

  public cancel() {
    this.isShowFundsForm = false;
  }

  public addFunds() {
    this.billingService.addFunds({ amount: this.amount }).subscribe(
      (res: any) => {
        this.amount = 20;
        this.isShowFundsForm = false;
      }
    );
  }

  public autoCharge() {
    this.group = new FormGroup({});
    this.modalConfig.forEach((el) => {
      el.value = this.smsBalance[el.key];
    });
    this.openModal();
  }

  public openModal() {
    this.modalRef = this.modalService.open(this.modal);
  }

  public saveAutoCharge() {
    this.billingService.setCreditDetails(this.group.value)
      .subscribe((res: any) => {
        this.smsBalance = res.sms_balance;
        this.modalRef.close();
      });
  }
}
