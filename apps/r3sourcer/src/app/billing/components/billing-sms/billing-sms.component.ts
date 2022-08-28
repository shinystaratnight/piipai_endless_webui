import { Component, OnInit, ViewChild, OnDestroy, Input, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { BillingService } from '../../services/billing-service';
import { autoChargeMetadata } from './billing-sms.metadata';
import { ToastService, MessageType } from '@webui/core';

@Component({
  selector: 'webui-billing-sms',
  templateUrl: './billing-sms.component.html',
  styleUrls: ['./billing-sms.component.scss'],
})
export class BillingSmsComponent implements OnInit, OnDestroy {
  @Input() currency = 'USD';
  @Input() cardExist!: boolean;

  public smsBalance: any;
  public amount = 20;
  public modalConfig = autoChargeMetadata;
  public modalRef!: NgbModalRef;
  public group!: FormGroup;
  public additionalData: any;

  @ViewChild('charge') public modal!: ElementRef;
  @ViewChild('funds') public fundsModal!: ElementRef;

  constructor(private billingService: BillingService, private modalService: NgbModal, private toastr: ToastService) {}

  ngOnInit() {
    this.getSmsBalance();
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public getSmsBalance(message?: boolean) {
    this.billingService.getCreditDetails().subscribe((res: any) => {
      if (message) {
        if (this.smsBalance !== res.sms_balance) {
          this.toastr.sendMessage('Balance has been updated', MessageType.Success);
        }
      }

      this.smsBalance = res.sms_balance;
    });
  }

  public showAddFundsForm() {
    if (this.cardExist) {
      this.openModal(this.fundsModal);
    }
  }

  public addFunds() {
    this.billingService.addFunds({ amount: this.amount }).subscribe((res: any) => {
      this.amount = 20;
      this.modalRef.close();
      this.toastr.sendMessage('Please wait a few seconds', MessageType.Info);
      setTimeout(() => {
        this.getSmsBalance(true);
      }, 10000);
    });
  }

  public autoCharge() {
    this.group = new FormGroup({});
    this.modalConfig.forEach((el) => {
      el.value = this.smsBalance[el.key];
    });
    this.openModal(this.modal);
  }

  public openModal(modal: any) {
    this.modalRef = this.modalService.open(modal, { backdrop: 'static' });
  }

  public saveAutoCharge() {
    this.billingService.setCreditDetails(this.group.value).subscribe((res: any) => {
      this.smsBalance = res.sms_balance;
      this.modalRef.close();
    });
  }
}
