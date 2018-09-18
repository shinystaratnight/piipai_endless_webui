import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'form-row',
  templateUrl: 'form-row.component.html',
  styleUrls: ['./form-row.component.scss']
})

export class FormRowComponent implements OnInit {
  public config: any;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public className: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public ngOnInit() {
    if (!this.config.editForm && this.config.label) {
      this.config.label = this.config.label.includes('{') ? '' : this.config.label;
    }

    this.className = this.config.className || 'items';

    this.checkChildrenOnReadOnlyProperty();
  }

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }

  public checkChildrenOnReadOnlyProperty() {
    if (!this.config.editForm) {
      this.config.children.forEach((column) => {
        if (column.children && column.children.length) {
          const count = column.children.length;
          let hiddenFields = 0;

          column.children.forEach((field) => {
            if (field.read_only && (field.type === 'input' || field.type === 'related')) {
              hiddenFields += 1;
            }
          });
          if (count === hiddenFields) {
            column.hidden = true;
          }
        }
      });
    }
  }
}
