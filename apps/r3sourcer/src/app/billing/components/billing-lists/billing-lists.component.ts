import { Component } from '@angular/core';

import { paymentMetadata, smsMetadata } from './billing-lists.metadata';
import { ListService, SortService } from '@webui/dynamic-form';

@Component({
  selector: 'app-billing-lists',
  templateUrl: './billing-lists.component.html',
  styleUrls: ['./billing-lists.component.scss'],
  providers: [ListService, SortService]
})
export class BillingListsComponent {
  public paymentConfig = paymentMetadata;
  public smsConfig = smsMetadata;
}
