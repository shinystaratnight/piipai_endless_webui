import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Button {
  label: string;
  endpoint: string;
  action: string;
}

@Component({
  selector: 'list-buttons',
  templateUrl: 'list-buttons.component.html'
})
export class ListButtonsComponent {

  @Input()
  public buttons: Button[];

  @Input()
  public first: boolean;

  @Input()
  public inForm: boolean;

  @Input()
  public label: string;

  @Input()
  public poped: boolean;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public buttonAction(type) {
    this.event.emit({
      type
    });
  }
}
