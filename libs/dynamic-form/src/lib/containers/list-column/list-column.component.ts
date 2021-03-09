import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { getTranslationKey } from '@webui/utilities';

@Component({
  selector: 'app-list-column',
  templateUrl: 'list-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListColumnComponent implements OnInit {
  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public config: any;
  public head: boolean;
  translationKey = '';
  sortView;

  ngOnInit() {
    this.translationKey = getTranslationKey(this.config.name, 'label');

    if (this.config.sortMap) {
      this.generateSortView();
      console.log(this.sortView);
    }
  }

  public sort(key?: string) {
    if (this.config.sort) {
      console.log(this.config.sortMap[key], key);
      if (key && this.config.sortMap[key]) {
        console.log(this.config.sortMap[key])

        this.event.emit({
          type: 'sort',
          name: this.config.sortMap[key]
        })
      } else {
        console.log(this.config.name)

        this.event.emit({
          type: 'sort',
          name: this.config.name,
        });
      }
    }
  }

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonHandler(e) {
    this.buttonAction.emit(e);
  }

  private generateSortView() {
    const keys = this.config.label.split('/');

    this.sortView = keys.map(key => key.toLowerCase().trim());
  }
}
