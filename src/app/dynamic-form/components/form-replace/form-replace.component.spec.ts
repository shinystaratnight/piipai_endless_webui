import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { FormReplaceComponent } from './form-replace.component';
import { Observable } from 'rxjs/Observable';
import { GenericFormService } from '../../services/generic-form.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('FormReplaceComponent', () => {
  let fixture: ComponentFixture<FormReplaceComponent>;
  let comp: FormReplaceComponent;
  let el;
  let config = {
    type: 'replace',
    key: 'test',
    templateOptions: {
      label: 'Hourle rate'
    },
    replace_by: [
      { create: 'company.skill.actions.create' },
      { text: 'company.skill.actions.text' },
      { change: 'company.skill.actions.edit'}
    ],
    elements: {
      create: {
        type: 'button',
        endpoint: '/ecore/api/v2/{company.id}/hourly_rate/',
        query: 'rate={company.skill.hourly_rate}',
        templateOptions: {
          text: 'Set hourly rate',
          p: true,
          small: true
        }
      },
      text: {
        type: 'static',
        key: 'company.__str__',
        read_only: true,
        templateOptions: {
          label: 'Hourly rate'
        }
      },
      change: {
        value: 'Change rate',
        type: 'link',
        endpoint: '/'
      }
    },
    data: {
      company: {
        skill: {
          hourly_rate: 25,
          actions: {
            create: true,
            text: true,
            edit: true,
          }
        },
        id: '123',
        __str__: 'General Construction Labourer $24.46/h'
      }
    }
  };
  let errors = {};
  const response = <any> {};

  const mockGenericFormservice = {
    getAll() {
      if (response.status === 'success') {
        return Observable.of(response.data);
      } else {
        return Observable.throw(response.error);
      }
    },
    getByQuery() {
      if (response.status === 'success') {
        return Observable.of(response.data);
      } else {
        return Observable.throw(response.error);
      }
    },
    delete() {
      if (response.status === 'success') {
        return Observable.of(response.data);
      } else {
        return Observable.throw(response.error);
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormReplaceComponent
      ],
      providers: [
        FormBuilder,
        { provide: GenericFormService, useValue: mockGenericFormservice }
      ],
      imports: [ ReactiveFormsModule, NgbModule.forRoot() ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormReplaceComponent);
      comp = fixture.componentInstance;
    });
  }));

  describe('ngOnInit method', () => {
    it('should init propeties',
      async(inject([FormBuilder], (fb: FormBuilder) => {
        comp.config = Object.assign(config);
        comp.group = fb.group({});
        comp.key = comp.config.key;
        comp.group.addControl(comp.key, fb.control(''));
        spyOn(comp, 'addControl');
        spyOn(comp, 'generateMetadata');
        comp.ngOnInit();
        expect(comp.metadata).toEqual([]);
        expect(comp.selfGroup).toBeDefined();
        expect(comp.modalData).toEqual({});
        expect(comp.addControl).toHaveBeenCalledWith(comp.config, fb);
        expect(comp.generateMetadata).toHaveBeenCalledWith(comp.config.replace_by);
    })));
  });

  describe('ngOnDestroy method', () => {
    it('should close modal', () => {
      comp.modalRef = {
        close() {
          return true;
        }
      };
      spyOn(comp.modalRef, 'close');
      comp.ngOnDestroy();
      expect(comp.modalRef.close).toHaveBeenCalled();
    });
  });

  describe('generateMetadata method', () => {
    it('should generate metedata by some rules', () => {
      comp.config = Object.assign(config);
      comp.metadata = [];
      spyOn(comp, 'getValueByKey').and.returnValue('mockValue');
      comp.generateMetadata(comp.config.replace_by);
      expect(comp.metadata).toEqual([
        {
          type: 'button',
          endpoint: '/ecore/api/v2/123/hourly_rate/',
          query: 'rate=25',
          templateOptions: {
            text: 'Set hourly rate',
            p: true,
            small: true
          }
        },
        {
          type: 'static',
          key: 'company.__str__',
          read_only: true,
          templateOptions: {
            label: 'Hourly rate'
          },
          value: 'mockValue'
        },
        {
          value: 'Change rate',
          type: 'link',
          endpoint: '/'
        }
      ]);
    });
  });

});
