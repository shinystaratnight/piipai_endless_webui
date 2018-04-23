import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'list-tags',
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
    this.display = this.config.display || '__str__';
    this.tags = this.config.value;

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
