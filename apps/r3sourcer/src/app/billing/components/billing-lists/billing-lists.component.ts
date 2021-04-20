import { Component, Input } from '@angular/core';

import { metadata, smsMetadata } from './billing-lists.metadata';
import { ListService, SortService } from '@webui/dynamic-form';

@Component({
  selector: 'app-billing-lists',
  templateUrl: './billing-lists.component.html',
  styleUrls: ['./billing-lists.component.scss'],
  providers: [ListService, SortService]
})
export class BillingListsComponent {

  @Input() public payments: any;

  public config = metadata;
  public smsConfig = smsMetadata;

}
