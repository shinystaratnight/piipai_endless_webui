import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dynamic-list',
  templateUrl: 'dynamic-list.component.html'
})

export class DynamicListComponent implements OnInit {
  @Input()
  public config: any[] = [];

  @Input()
  public data: any[] = [];

  public body: any[] = [];

  public ngOnInit() {
    this.body = this.prepareData(this.config, this.data);
  }

  public prepareData(config, data) {
    let prepareData = [];
    data.forEach((el) => {
      let row = [];
      config.forEach((col) => {
        let cell = [];
        col.content.forEach((element) => {
          let obj = {};
          obj['name'] = element.field;
          obj['type'] = element.type;
          obj['href'] = element.href ? element.href : null;
          if (el[element.field]) {
            obj['value'] = el[element.field];
          }
          cell.push(obj);
        });
        row.push(cell);
      });
      prepareData.push(row);
    });
    return prepareData;
  }

}
