import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'list-column',
  templateUrl: 'list-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListColumnComponent {
  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public config: any;
  public head: boolean;

  public sort() {
    if (this.config.sort) {
      this.event.emit({
        type: 'sort',
        name: this.config.name
      });
    }
  }

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonHandler(e) {
    this.buttonAction.emit(e);
  }

}
