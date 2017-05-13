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

  public getData(endpoint, query = null) {
    if (query) {
      this.gfs.getByQuery(endpoint, query).subscribe(
        (data) => this.data = data
      );
    } else {
      this.gfs.getAll(endpoint).subscribe(
        (data) => this.data = data
      );
    }
  }

  public eventHandler(e) {
    if (!this.queries[e.list]) {
      this.queries[e.list] = {};
    }
    if (e.type === 'sort') {
      this.queries[e.list].sort = e.query;
    } else if (e.type === 'pagination') {
      this.queries[e.list].pagination = e.query;
    }
    this.getData(this.endpoint, this.generateQuery(this.queries[e.list]));
  }

  public generateQuery(queries) {
    let result = '?';
    let queryList = Object.keys(queries);
    queryList.forEach((el) => {
      if (queries[el]) {
        result += `${queries[el]}&`;
      }
    });
    return result.slice(0, result.length - 1);
  }

}
