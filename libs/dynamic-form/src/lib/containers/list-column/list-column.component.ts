import {
  Component,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { getTranslationKey } from '@webui/utilities';

@Component({
  selector: 'app-list-column',
  templateUrl: 'list-column.component.html',
})
export class ListColumnComponent implements OnInit {
  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public config: any;
  public head: boolean;
  translationKey = '';
  sortView: string[];

  ngOnInit() {
    this.translationKey = getTranslationKey(this.config.name, 'label');

    if (this.config.sortMap) {
      this.generateSortView();
    }
  }

  public sort(key?: string) {
    const { sort, sortMap } = this.config;

    if (!sort) {
      return;
    }

    if (sortMap) {
      const el = sortMap.find(({ name }) => name.trim() === key.trim());

      if (!el) {
        return;
      }

      this.eventHandler({
        type: 'sort',
        name: el.name
      })
    } else {
      this.eventHandler({
        type: 'sort',
        name: this.config.name,
      });
    }
  }

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonHandler(e) {
    this.buttonAction.emit(e);
  }

  public getSortedValue(key: string) {
    const el = this.config.sortMap.find(({ name }) => name == key);

    if (el) {
      return el.sorted;
    } else {
      return '';
    }
  }

  private generateSortView() {
    const keys = this.config.label.split('/');

    this.sortView = keys.map(key => key.toLowerCase().trim());
  }
}
