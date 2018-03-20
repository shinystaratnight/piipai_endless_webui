import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { GenericFormService } from '../../dynamic-form/services/generic-form.service';

@Component({
  selector: 'fill-in',
  templateUrl: 'fill-in.component.html'
})

export class FillInComponent implements OnInit {

  @Input()
  public endpoint: string;

  @Input()
  public pageData: any;

  public meta: any[];
  public data: string[];
  public err: any;

  constructor(
    private location: Location,
    private gfs: GenericFormService,
    private router: Router
  ) {}

  public ngOnInit() {
    this.meta = [
      {
        type: 'list',
        collapsed: false,
        endpoint: this.endpoint,
        responseField: 'list',
        paginated: 'off',
        supportData: 'job',
        metaType: true,
        actions: true,
        templateOptions: {
          label: '',
          text: ''
        }
      }
    ];
  }

  public checkedObjects(e) {
    this.data = e;
  }

  public back() {
    this.router.navigate([this.pageData.pathData.path + '/' + this.getId(this.pageData.endpoint) + '/change']); //tslint:disable-line
  }

  public sendData() {
    if (this.data && this.data.length) {
      this.gfs.submitForm(this.endpoint, this.data).subscribe(
        (res: any) => this.router.navigate([this.pageData.pathData.path + '/' + this.getId(this.pageData.endpoint) + '/change']), //tslint:disable-line
        (err: any) => this.err = err
      );
    }
  }

  public getId(path: string): string {
    const keys = path.split('/');

    return keys[keys.length - 3];
  }
}
