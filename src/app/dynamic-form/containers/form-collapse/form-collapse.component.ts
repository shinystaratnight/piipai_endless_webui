import { Component,  Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'form-collapse',
  templateUrl: 'form-collapse.component.html'
})

export class FormCollapseComponent  {
  public config: any;
  public group: FormGroup;
  public errors: any;
  public message: any;

  public isCollapsed = false;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  @Output()
  public resourseData: EventEmitter<any> = new EventEmitter();

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }

  public resourseDataHandler(e) {
    this.resourseData.emit(e);
  }
}
