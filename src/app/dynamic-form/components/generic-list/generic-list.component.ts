import { Component, Input, OnInit } from '@angular/core';
import { GenericFormService } from './../../services/generic-form.service';
import { FilterService } from './../../services/filter.service';

@Component({
  selector: 'generic-list',
  templateUrl: 'generic-list.component.html'
})

export class GenericListComponent implements OnInit {

  @Input()
  public endpoint: string = '';

  public metadata: any[] = [];
  public data: any;

  constructor(
    private gfs: GenericFormService,
    private fs: FilterService
  ) { }

  public ngOnInit() {
    this.getMetadata(this.endpoint);
    this.getData(this.endpoint);
  }

  public getMetadata(endpoint) {
    this.gfs.getMetadata(endpoint).subscribe(
      (metadata) => this.metadata = metadata
    );
  }

  public getData(endpoint) {
    this.gfs.getAll(endpoint).subscribe(
      (data) => this.data = data.results
    );
  }

}
