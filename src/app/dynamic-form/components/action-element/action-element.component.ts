import { Component, Input, ViewChild, EventEmitter, Output, OnChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormatString } from '../../../helpers/format';

@Component({
  selector: 'action-element',
  templateUrl: 'action-element.component.html',
  styleUrls: ['./action-element.component.scss']
})
export class ActionElementComponent implements OnChanges {
  @Input()
  public config: any;

  @Input() public count: number;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @ViewChild('content')
  public content: any;

  public action: any;
  public closeResult: string;
  public data: any;
  public label: string;

  public constructor(
    private modalService: NgbModal
  ) {}

  public ngOnChanges() {
    this.data = {
      count: this.count
    };
    const format = new FormatString();
    this.label = format.format(this.config.button_label, this.data);
  }

  public toDoAction() {
    if (this.action && this.action.confirm) {
      this.open(this.content);
    } else if (this.action && !this.action.confirm) {
      this.event.emit({
        action: this.action
      });
    }
  }

  public open(content) {
    this.modalService.open(content).result.then((result) => {
      if (result) {
        this.event.emit({
          action: this.action
        });
        this.action = '';
      }
    }, (reason) => {
      return false;
    });
  }

}
