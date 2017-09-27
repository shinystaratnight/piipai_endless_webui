import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'action-element',
  templateUrl: 'action-element.component.html'
})
export class ActionElementComponent {
  @Input()
  public config: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @ViewChild('content')
  public content: any;

  public action: any;
  public closeResult: string;

  public constructor(
    private modalService: NgbModal
  ) {}

  public toDoAction() {
    if (this.action && this.action.confirm) {
      this.open(this.content);
    } else if (this.action && !this.action.confirm) {
      this.event.emit({
        action: this.action
      });
      this.action = '';
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
