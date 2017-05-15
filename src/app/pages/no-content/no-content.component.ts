import { Component } from '@angular/core';

@Component({
  selector: 'no-content',
  template: `
    <div>
      <h1>404: page missing</h1>
    </div>
    <generic-list
      [endpoint]="'http://172.18.0.6:8081/ecore/api/v2/endless-core/companyaddresses/'">
    </generic-list>
  `
})
export class NoContentComponent {}
