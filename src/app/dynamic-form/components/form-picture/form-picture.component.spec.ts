import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormPictureComponent } from './form-picture.component';
import { WebCamComponent } from 'ng2-webcam';
import { FallbackDispatcher } from 'ng2-webcam';

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
  let mime = 'image/jpeg';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormPictureComponent,
        WebCamComponent
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
      expect(comp.mime).toEqual('image/jpeg');
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
      comp.photoExist = true;
      spyOn(comp.modalService, 'open');
      comp.open();
      expect(comp.modalService.open).toHaveBeenCalledWith(comp.modal, {size: 'lg'});
      expect(comp.photoExist).toBeFalsy();
    });

  });

  describe('onSuccess method', () => {

    it('should call onFallback method', () => {
      comp.config = config;
      let stream =  new FallbackDispatcher({
        capture() {
          return true;
        },
        save() {
          return true;
        },
        setCamera() {
          return true;
        },
        getCameraList() {
          return true;
        },
        width: 320,
        height: 240
      });
      spyOn(comp, 'onFallback');
      comp.onSuccess(stream);
      expect(comp.flashPlayer).toEqual(stream);
      expect(comp.onFallback).toHaveBeenCalled();
    });

  });

  describe('onError method', () => {

    it('should call onFallback method', () => {
      comp.config = config;
      let error = 'some error';
      comp.onError(error);
      expect(comp.err).toEqual(error);
    });

  });

  describe('getPhoto method', () => {

    it('should convert image into base64', () => {
      comp.config = config;
      comp.mime = mime;
      spyOn(comp, 'createPhoto').and.returnValue({
        toDataURL(type) {
          return 'some base64';
        }
      });
      spyOn(comp, 'updateValue');
      comp.getPhoto();
      expect(comp.createPhoto);
      expect(comp.updateValue).toHaveBeenCalledWith('image.jpeg', 'some base64');
    });

  });

  describe('createPhoto method', () => {

    it('should get photo from webcam', () => {
      comp.config = config;
      comp.photoExist = false;
      document.getElementsByTagName = (name): any => {
        let array = [];
        array.push(document.createElement(name));
        return array;
      };
      let result = comp.createPhoto();
      expect(comp.photoExist).toBeTruthy();
      expect(result).toBeDefined();
    });

    it('should get photo from webcam with flash', () => {
      comp.config = config;
      comp.photoExist = false;
      comp.flashPlayer = {
        capture() {
          return true;
        }
      };
      document.getElementsByTagName = (name): any => {
        return '';
      };
      spyOn(comp.flashPlayer, 'capture');
      comp.createPhoto();
      expect(comp.photoExist).toBeTruthy();
      expect(comp.flashPlayer.capture).toHaveBeenCalled();
    });

  });

  describe('fileChangeEvent method', () => {

    it('should update value by file', () => {
      comp.config = config;
      let event = {
        target: {
          files: [{
            name: 'index.html',
            type: 'text/html'
          }]
        }
      };
      FileReader.prototype.readAsDataURL = () => {
        this.result = 'some result';
      };
      comp.fileChangeEvent(event);
    });

  });

  describe('updateValue method', () => {

    it('should update value', inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.key = 'picture';
      comp.group = fb.group({});
      comp.group.addControl(comp.key, fb.control(''));
      let name = 'image.jpeg';
      let value = 'some string';
      comp.updateValue(name, value);
      expect(comp.fileName).toEqual(name);
      expect(comp.group.get(comp.key).value).toEqual(value);
    }));

  });

});
