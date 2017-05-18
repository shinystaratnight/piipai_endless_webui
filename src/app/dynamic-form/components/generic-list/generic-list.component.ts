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
  public tables = [];
  public first: boolean = false;
  public tableId: number = 1;
  public existingIds: number[] = [];

  constructor(
    private gfs: GenericFormService,
    private fs: FilterService
  ) { }

  public ngOnInit() {
    this.tables.push(this.createTableData(this.endpoint));
  }

  public getMetadata(endpoint, table) {
    this.gfs.getMetadata(endpoint).subscribe(
      (metadata) => {
        table.metadata = metadata;
        table.list = metadata.list.list;
        this.existingIds.push(this.tableId);
        table.id = this.tableId++;
      }
    );
  }

  public getData(endpoint, query = null, table) {
    if (query) {
      this.gfs.getByQuery(endpoint, query).subscribe(
        (data) => table.data = data
      );
    } else {
      this.gfs.getAll(endpoint).subscribe(
        (data) => table.data = data
      );
    }
  }

  public eventHandler(e) {
    let table = this.getTable(e.list);
    if (!table.query) {
      table.query = {};
    }
    if (e.type === 'sort' || e.type === 'pagination' || e.type === 'filter') {
      table.query[e.type] = e.query;
      this.getData(table.endpoint, this.generateQuery(table.query), table);
    } else if (e.type === 'close') {
      this.tables.splice(this.tables.indexOf(table), 1);
    } else if (e.type === 'active') {
      this.resetActiveTable(this.tables);
      table.active = true;
    }
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

  public createTableData(endpoint) {
    let table = {
      endpoint
    };
    if (!this.first) {
      table['first'] = true;
      this.first = true;
    }
    this.getMetadata(endpoint, table);
    this.getData(endpoint, null, table);
    return table;
  }

  public getTable(name) {
    return this.tables.filter((el) => el.list === name)[0];
  }

  public resetActiveTable(tables) {
    tables.forEach((el) => {
      el.active = false;
    });
  }

  public listHandler(e) {
    if (this.checkList(e.endpoint)) {
      this.tables.push(this.createTableData(e.endpoint));
    }
  }

  public checkList(endpoint) {
    let result = this.tables.filter((el) => el.endpoint === endpoint);
    return !result.length;
  }

}
