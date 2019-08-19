import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormatString, getPropValue } from '@webui/utilities';

import { CustomEvent } from '../../../models';
import { ListService } from '../../../services';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss']
})
export class ListFormComponent implements OnInit {
  config: any;
  value: string;
  showSaveButton: boolean;

  group = new FormGroup({});

  constructor(private service: ListService) {}

  ngOnInit() {
    this.setValue(this.config.form.value, this.config.display);
  }

  eventHandler(event: CustomEvent) {
    this.showSaveButton = event.value !== this.config.value;
  }

  saveChanges() {
    this.service.updateListObject('', this.config.rowId, this.group.value);
  }

  private setValue(value: any, display: string) {
    this.value = value && display ? display : value;
  }
}
