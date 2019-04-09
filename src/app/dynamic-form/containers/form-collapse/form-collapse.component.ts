import { Component,  Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-collapse',
  templateUrl: 'form-collapse.component.html'
})

export class FormCollapseComponent implements OnInit  {
  public config: any;
  public group: FormGroup;
  public errors: any;
  public message: any;

  public isCollapsed = false;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public ngOnInit() {
    this.isCollapsed = this.config.collapsed;
  }

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }
}
