import { Component, OnInit } from '@angular/core';

import { FormatString } from '@webui/utilities';

@Component({
  selector: 'app-list-tags',
  templateUrl: 'list-tags.component.html',
  styleUrls: ['./list-tags.component.scss']
})

export class ListTagsComponent implements OnInit {
  public config: any;

  public display: string;
  public tags: any[];

  public color: any;
  public colorAttr: string;

  public ngOnInit() {
    const formatSting = new FormatString();

    this.display = this.config.display || '{__str__}';
    this.tags = this.config.value;

    this.tags.forEach((el) => {
      if (el) {
        el.__str__ = formatSting.format(this.display, el);
      }
    });

    this.color = this.config.color;
    this.colorAttr = this.config.color_attr;
  }

  public checkClass(item) {
    if (this.config.outline) {
      let className;
      if (this.color && this.colorAttr) {
        const keys = Object.keys(this.color);

        keys.forEach((key) => {
          className = this.color[key].indexOf(item[this.colorAttr]) > -1 ? key : 'success';
        });
      }

      return className || 'success';
    }

    return '';
  }
}
