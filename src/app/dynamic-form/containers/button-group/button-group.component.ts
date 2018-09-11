import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit
} from '@angular/core';

import { getValueOfData } from '../../helpers/utils';
import { FormatString } from '../../../helpers/format';

@Component({
  selector: 'button-group',
  templateUrl: './button-group.component.html'
})
export class ButtonGroupComponent implements OnInit {
  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public config: any;
  public data: any[];

  public ngOnInit() {
    if (this.config.value && this.config.value.length) {
      const formatString = new FormatString();

      this.data = this.config.value.map((item) => {
        const result = this.config.content.map((el) => {
          const obj = {
            ...el,
            endpoint: formatString.format(el.endpoint, item)
          };

          if (obj.endpoint[obj.endpoint.length - 1] !== '/') {
            obj.notParsedEndpoint = obj.endpoint;
            obj.endpoint += '/';
          }

          getValueOfData(item, el.field, obj);
          obj.hidden = !obj.value;

          return obj;
        });

        return result;
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
