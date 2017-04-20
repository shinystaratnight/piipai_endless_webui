import { Component, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'form-row',
  templateUrl: 'form-row.component.html'
})

export class FormRowComponent implements OnInit, OnChanges {
  public config: any;
  public group: FormGroup;
  public errors: any;
  public message: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public ngOnInit() {
    this.checkMetadata();
  }

  public ngOnChanges() {
    this.checkMetadata();
  }

  public checkMetadata() {
    const children = [];
    this.config.children.forEach((el) => {
      if (!el.read_only) {
        children.push(el);
      }
    });
    this.config.children = children;
  }

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }
}
