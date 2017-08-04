import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  HostListener
} from '@angular/core';

import { GenericFormService } from '../../dynamic-form/services/generic-form.service';

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.component.html'
})

export class NavigationComponent implements OnInit, AfterViewInit {

  @ViewChild('header')
  public header: any;

  @ViewChild('list')
  public list: any;

  @ViewChild('item')
  public item: any;

  @ViewChild('nav')
  public nav: any;

  public headerHeight: number;
  public endpoint: string;
  public pages: any[];
  public error: any;
  public isCollapsed: boolean = false;

  constructor(
    private service: GenericFormService
  ) { }

  public ngOnInit() {
    this.endpoint = '/ecore/api/v2/endless-core/extranetnavigations/';
    this.getPagesList();
  }

  public getPagesList() {
    this.service.getAll(this.endpoint).subscribe(
      (res: any) => this.pages = res.results,
      (err: any) => this.error = err
    );
  }

  public ngAfterViewInit() {
    this.headerHeight = this.header.nativeElement.clientHeight;
  }

  @HostListener('document:click', ['$event'])
  public handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (clickedComponent === this.nav.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      this.isCollapsed = false;
    }
  }
}
