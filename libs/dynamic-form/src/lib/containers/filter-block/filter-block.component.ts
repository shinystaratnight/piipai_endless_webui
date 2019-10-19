import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-block',
  templateUrl: 'filter-block.component.html',
  styleUrls: ['./filter-block.component.scss']
})
export class FilterBlockComponent {
  @Input()
  public config: any[] = [];

  @Input()
  public inline: boolean;
  @Input()
  public container: boolean;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public direction = 'down';

  public changeQuery(e) {
    this.event.emit(e);
  }

  public resetAll() {
    this.event.emit('resetAll');
  }
}
