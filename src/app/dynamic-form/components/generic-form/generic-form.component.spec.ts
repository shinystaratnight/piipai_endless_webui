import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GenericFormComponent } from './generic-form.component';
import { GenericFormService } from './../../services/generic-form.service';

describe('EnterTheComponentName', () => {
    let fixture: ComponentFixture<GenericFormComponent>;
    let comp: GenericFormComponent;
    let el;
    let metadata = [];
    let metadataError = [];
    let response = null;
    let errors = null;
    let sendData = null;
    let serviceMock = {
      getMetadata() {
        if (response.status === 'error') {
          return Observable.throw(response);
        }
        return Observable.of(metadata);
      },
      submitForm() {
        if (response.status === 'error') {
          return Observable.throw(response);
        }
        return Observable.of(response);
      }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                GenericFormComponent
            ],
            providers: [{provide: GenericFormService, useValue: serviceMock}],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GenericFormComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should enter the assertion', () => {
        fixture.detectChanges();
        expect(2).toEqual(2);
    });

    describe('ngOnInit method', () => {

      it('should be defined', async(() => {
        expect(comp.ngOnInit).toBeDefined();
      }));

      it('should called getMetadata method', async(() => {
        response = {
          status: 'success',
          type: 'input'
        };
        comp.endpoint = 'endoint';
        spyOn(comp, 'getMetadata');
        comp.ngOnInit();
        expect(comp.getMetadata).toHaveBeenCalled();
      }));

    });

    describe('ngOnChanges method', () => {

      it('should be defined', async(() => {
        expect(comp.ngOnChanges).toBeDefined();
      }));

      it('should called getMetadata method', async(() => {
        response = {
          status: 'success',
          type: 'input'
        };
        comp.endpoint = 'endoint';
        spyOn(comp, 'getMetadata');
        comp.ngOnChanges();
        expect(comp.getMetadata).toHaveBeenCalled();
      }));

    });

    describe('getMetadata method', () => {

      it('should be defined', async(() => {
        expect(comp.getMetadata).toBeDefined();
      }));

      it('should update metadata property', async(() => {
        response.status = 'success';
        metadata = [{
          type: 'checkbox',
          key: 'is_available',
          templateOptions: {
            label: 'test',
            type: 'checkbox',
            required: true
          }
        }];
        let endpoint = 'endpoint';
        comp.getMetadata(endpoint);
        expect(comp.metadata).toEqual(metadata);
      }));

      it('should update metadataError property', async(() => {
        response = {
          status: 'error'
        };
        let endpoint = 'endpoint';
        comp.getMetadata(endpoint);
        expect(comp.metadataError).toEqual(response);
      }));

    });

    describe('submitForm method', () => {

      it('should be defined', async(() => {
        expect(comp.submitForm).toBeDefined();
      }));

      it('should update response property', async(() => {
        response = {
          status: 'success',
          message: 'All be fine'
        };
        comp.endpoint = 'endpoint';
        let data = {username: 'test'};
        fixture.detectChanges();
        comp.submitForm(data);
        expect(comp.response).toEqual(response);
      }));

      it('should update error property', async(() => {
        response = {
          status: 'error',
          errors: {
            email: 'Is not valid'
          }
        };
        comp.endpoint = 'endpoint';
        let data = {username: 'test'};
        fixture.detectChanges();
        comp.submitForm(data);
        expect(comp.errors).toEqual(response.errors);
      }));

    });
});
