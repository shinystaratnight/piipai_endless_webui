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

  public metadata: any;
  public data: any;
  public queries: any;

  constructor(
    private gfs: GenericFormService,
    private fs: FilterService
  ) { }

  public ngOnInit() {
    this.queries = {};
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

  public eventHandler(e) {
    if (e.type === 'sort') {
      this.queries[e.list] = this.sortTable(e);
    }
  }

  public sortTable(e) {
    let query = 'o=';
    let queries = '';
    let columns = Object.keys(e.sort);
    columns.forEach((el) => {
      if (e.sort[el] === 'desc') {
        queries += `-${el},`;
      } else if (e.sort[el] === 'asc') {
        queries += `${el},`;
      }
    });
    query += queries.slice(0, queries.length - 1);
    return query;
  }

}
