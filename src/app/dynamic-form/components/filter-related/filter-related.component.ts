import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'filter-related',
  templateUrl: 'filter-related.component.html'
})
export class FilterRelatedComponent implements OnInit {
  public config: any;
  public data: any;
  public elements = [];
  public count: number;

  public ngOnInit() {
    this.count = 1;
    this.elements.push(this.createElement(this.count));
  }

  public deleteValue(item) {
    item.data = null;
  }

  public addElement() {
    this.elements.push(this.createElement(this.count));
  }

  public deleteElement(item) {
    if (this.elements.length > 1) {
      let result = this.elements.filter((el) => el.id !== item.id);
      this.elements = result;
    }
  }

  public createElement(id) {
    this.count++;
    return {
      id,
      data: ''
    };
  }
}
