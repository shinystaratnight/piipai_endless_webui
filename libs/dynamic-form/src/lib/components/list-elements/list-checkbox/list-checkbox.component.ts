import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'webui-list-checkbox',
  templateUrl: './list-checkbox.component.html',
  styleUrls: ['./list-checkbox.component.scss'],
})

export class ListCheckboxComponent implements OnInit {
  public config: any;
  public value: any;
  public iconClass = '';

  public buttonAction!: EventEmitter<any>;

  public ngOnInit() {
    console.log(this);
    if (this.config.values) {
      this.value = this.config.values[this.config.value];
    }

    if (this.config.color) {
      const classes = ['primary', 'danger', 'info', 'success', 'warning', 'muted'];
      const color = this.config.color[this.config.value];
      this.iconClass = classes.indexOf(color) > -1 ? `text-${color}` : '';
    }
  }

  public buttonHandler(event: any) {
    this.buttonAction.emit(event);
  }

  getTranslationKey(value: any) {
    return `${this.config.translateKey || this.config.key}.${value}`;
  }

};
