import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'form-row',
  templateUrl: 'form-row.component.html'
})

export class FormRowComponent implements OnInit {
  public config: any;
  public group: FormGroup;
  public errors: any;

  public ngOnInit() {
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
}
