import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'list-checkbox',
  templateUrl: 'list-checkbox.component.html'
})

export class ListCheckboxComponent implements OnInit {
  public config: any;
  public value: any;

  public ngOnInit() {
    this.value = this.config.values[this.config.value];
  }

};
