import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'action-element',
  templateUrl: 'action-element.component.html'
})
export class ActionElementComponent {
  @Input()
  public config: any;

  @ViewChild('content')
  public content: any;

  public action: any;
  public closeResult: string;

  public constructor(
    private modalService: NgbModal
  ) {}

  public toDoAction() {
    this.open(this.content);
  }

  public open(content) {
    this.modalService.open(content).result.then((result) => {
      if (result) {
        console.log(result);
      }
    }, (reason) => {
      return false;
    });
  }

}
