import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FilterEvent } from '../../interfaces';

@Component({
  selector: 'app-filter-block',
  templateUrl: './filter-block.component.html',
  styleUrls: ['./filter-block.component.scss']
})
export class FilterBlockComponent {
  @Input() public config: any[] = [];
  @Input() public inline: boolean;
  @Input() public container: boolean;
  @Input() public key: string;

  @Output()
  public event: EventEmitter<FilterEvent> = new EventEmitter();

  public direction = 'down';

  public changeQuery(e) {
    this.event.emit(e);
  }

  public resetAll() {
    this.event.emit({ list: this.key, reset: true });
  }
}
