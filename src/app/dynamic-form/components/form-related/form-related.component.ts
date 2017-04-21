import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
  OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';

@Component({
  selector: 'form-related',
  templateUrl: 'form-related.component.html'
})

export class FormRelatedComponent
  extends BasicElementComponent
    implements OnInit, AfterViewInit {
  @ViewChild('related')
  public related;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public resourseData: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) { super(); }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    if (!this.config.related) {
      this.resourseData.emit({
        key: this.config.key,
        endpoint: this.config.endpoint
      });
    }
  }

  public ngAfterViewInit() {
    this.addFlags(this.related, this.config);
  }

  public eventHandler(e) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value: this.config.options.filter((el) => el.id === this.group.get(this.key).value)
    });
  }
}
