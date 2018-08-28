import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'list-checkbox',
  templateUrl: 'list-checkbox.component.html'
})

export class ListCheckboxComponent implements OnInit {
  public config: any;
  public value: any;
  public iconClass: string = '';

  public ngOnInit() {
    if (this.config.values) {
      this.value = this.config.values[this.config.value];
    }

    if (this.config.color) {
      const classes = ['primary', 'danger', 'info', 'success', 'warning', 'muted'];
      const color = this.config.color[this.config.value];
      this.iconClass = classes.indexOf(color) > -1 ? `text-${color}` : '';
    }
  }

};
