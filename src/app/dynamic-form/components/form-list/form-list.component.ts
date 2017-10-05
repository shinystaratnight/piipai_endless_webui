import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'form-list',
  templateUrl: 'form-list.component.html'
})

export class FormListComponent implements OnInit {

  public isCollapsed: boolean;
  public data: any;

  public config;
  public errors: any;
  public message: any;
  public key: any;
  public label: boolean;

  public ngOnInit() {
    this.data = {
      [this.config.parent_field]: {
        action: 'add',
        data: { value: this.config.id }
      }
    };
    this.isCollapsed = this.config.collapsed ? this.config.collapsed : false;
  }
}
