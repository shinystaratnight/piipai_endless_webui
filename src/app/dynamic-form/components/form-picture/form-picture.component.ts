import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BasicElementComponent } from './../basic-element/basic-element.component';

@Component({
  selector: 'form-picture',
  templateUrl: 'form-picture.component.html'
})

export class FormPictureComponent extends BasicElementComponent implements OnInit, AfterViewInit {

  @ViewChild('modal')
  public modal;

  @ViewChild('picture')
  public picture;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;

  constructor(
    private fb: FormBuilder,
    public modalService: NgbModal
  ) { super(); }

  public ngOnInit(): void {
    this.addControl(this.config, this.fb);
  }

  public ngAfterViewInit() {
    this.addFlags(this.picture, this.config);
  }

  public upload(): void {
    this.picture.nativeElement.click();
  }

  public open(): void {
    this.modalService.open(this.modal, {size: 'lg'});
  }

}
