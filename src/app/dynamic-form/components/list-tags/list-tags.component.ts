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
  public outlineClass: boolean;
  public successClass: boolean;
  public dangerClass: boolean;

  public ngOnInit() {
    console.log(this);
    this.display = this.config.display || '__str__';
    this.tags = this.config.value;
    this.outlineClass = this.config.outline;
    this.successClass = this.config.available;
    this.dangerClass = !this.config.available;
  }
}
