import { Component } from '@angular/core';

@Component({
  selector: 'webui-list-fillin-tags',
  templateUrl: './list-fillin-tags.component.html',
  styleUrls: ['./list-fillin-tags.component.scss']
})
export class ListFillinTagsComponent {

  public config!: any;

  public labels = {
    required: 'Required',
    missing: 'Missing',
    existing: 'Existing'
  };

}
