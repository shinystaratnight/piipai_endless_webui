import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormatString, getPropValue } from '@webui/utilities';
import { SiteSettingsService } from '@webui/core';

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

  constructor(
    private service: ListService,
    private settingsService: SiteSettingsService,
  ) {}

  ngOnInit() {
    this.setValue(this.config.form.value, this.config.display);
  }

  eventHandler(event: CustomEvent) {
    this.showSaveButton = event.value !== this.config.value;
  }

  saveChanges() {
    const { create, rowData } = this.config;

    const exist = getPropValue(this.config.rowData, create.exist);

    if (!exist) {
      const endpoint = create.endpoint;
      const data = {};

      Object.keys(create.fields).forEach((key: string) => {
        if (create.fields[key] === 'currentCompany') {
          data[key] = this.settingsService.settings.company_settings.company;
        } else if (typeof create.fields[key] === 'string') {
          data[key] = getPropValue(rowData, create.fields[key]);
        } else {
          data[key] = create.fields[key];
        }
      });

      this.service.createObject(endpoint, data)
        .subscribe((res: any) => {
          Object.assign(this.config.rowData, { skill_id: res.id });
          this.updateObject()
        })
    } else {
      this.updateObject();
    }
  }

  private updateObject() {
    const endpoint = FormatString.format(this.config.update.endpoint, this.config.rowData);
    const data = {};
    this.config.update.fields.forEach((field) => {
      data[field] = getPropValue(this.config.rowData, field);
    });

    this.service.updateListObject(endpoint, this.config.rowId, { ...data, ...this.group.value });
  }

  private setValue(value: any, display: string) {
    this.value = value && display ? display : value;
  }
}
