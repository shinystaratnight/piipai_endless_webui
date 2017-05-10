import { Component, Input } from '@angular/core';
import { GenericFormService } from './../../services/generic-form.service';
import { FilterService } from './../../services/filter.service';

@Component({
  selector: 'generic-list',
  templateUrl: 'generic-list.component.html'
})

export class GenericListComponent {

  @Input()
  public endpoint: string = '';

  public metadata: any[] = [];

  constructor(
    private gfs: GenericFormService,
    private fs: FilterService
  ) { }

  public getMetadata(endpoint) {
    this.gfs.getMetadata(endpoint).subscribe(
      (data) => this.metadata = data
    );
  }

}
