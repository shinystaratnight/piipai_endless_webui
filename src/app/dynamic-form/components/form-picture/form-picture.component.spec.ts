import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormPictureComponent } from './form-picture.component';

describe('FormPictureComponent', () => {
  let fixture: ComponentFixture<FormPictureComponent>;
  let comp: FormPictureComponent;
  let el;
  let config = {
    type: 'picture',
    key: 'name field',
    read_only: false,
    templateOptions: {
      label: 'Picture',
      label_upload: 'Choose a file',
      label_photo: 'Take a photo',
      type: 'file',
      required: false,
      description: 'help text'
    }
  };
  let errors = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormPictureComponent
      ],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule, NgbModule.forRoot()],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormPictureComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter the assertion', async(inject([FormBuilder], (fb: FormBuilder) => {
    comp.config = config;
    comp.group = fb.group({});
    comp.errors = errors;
    fixture.detectChanges();
    expect(comp.errors).toBeDefined();
    expect(comp.config).toBeDefined();
  })));

  describe('ngOnInit method', () => {

    it('should call addControl method', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      spyOn(comp, 'addControl');
      comp.ngOnInit();
      expect(comp.addControl).toHaveBeenCalledWith(comp.config, fb);
    })));

  });

  describe('ngAfterViewInit method', () => {

    it('should call addFlag method', () => {
      comp.config = config;
      comp.picture = {};
      spyOn(comp, 'addFlags');
      comp.ngAfterViewInit();
      expect(comp.addFlags).toHaveBeenCalledWith(comp.picture, comp.config);
    });

  });

  describe('upload method', () => {

    it('should upload file from system', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.picture = {
        nativeElement: {
          click() {
            return true;
          }
        }
      };
      comp.modal = {};
      spyOn(comp.picture.nativeElement, 'click');
      comp.upload();
      expect(comp.picture.nativeElement.click).toHaveBeenCalled();
    })));

  });

  describe('open method', () => {

    it('should open modal window for take a photo', () => {
      comp.config = config;
      comp.modal = {};
      spyOn(comp.modalService, 'open');
      comp.open();
      expect(comp.modalService.open).toHaveBeenCalledWith(comp.modal, {size: 'lg'});
    });

  });

});
