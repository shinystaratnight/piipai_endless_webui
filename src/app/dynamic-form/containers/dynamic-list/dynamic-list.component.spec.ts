import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DynamicListComponent } from './dynamic-list.component';

describe('DynamicListComponent', () => {
  let fixture: ComponentFixture<DynamicListComponent>;
  let comp: DynamicListComponent;
  let el;
  let config =  [
      {
        name: 'first_name',
        label: 'First Name',
        content: [
          {
            field: 'first_name',
            type: 'text',
          }
        ]
      },
      {
        name: 'phone_mobile',
        label: 'Mobile Phone',
        content: [
          {
            field: 'phone_mobile',
            type: 'link',
            href: 'phone'
          },
          {
            field: 'email',
            type: 'link',
            href: 'email'
          },
          {
            field: 'last_name',
            type: 'link',
            href: 'login'
          }
        ]
      }
    ];

  let data = [{
        title: null,
        first_name: 'Test',
        last_name: 'Testovich',
        email: 'test.testovich@gmail.com',
        phone_mobile: '+380978107725',
        gender: null,
        is_available: true,
        marital_status: null,
        birthday: null,
        spouse_name: '',
        children: null,
        picture: null,
        address: null,
        id: '8ffddc8b-058b-4d71-94fb-f95eed60cbf9'
    }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DynamicListComponent
      ],
      providers: [],
      imports: [],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DynamicListComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter the assertion', async() => {
    comp.config = config;
    fixture.detectChanges();
    expect(comp.config).toBeDefined();
  });

  describe('ngOnInit method', () => {

    it('should called createHref method', async(() => {
      comp.config = config;
      spyOn(comp, 'prepareData');
      comp.ngOnInit();
      expect(comp.prepareData).toHaveBeenCalled();
    }));

  });

  describe('prepareData method', () => {

    it('should prepare data for body', async(() => {
      let body = [{
        id: '8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
        content: [
          {
            name: 'first_name',
            content: [
              {
                name: 'first_name',
                type: 'text',
                href: null,
                value: 'Test'
              }
            ],
            contextMenu: undefined
          },
          {
            name: 'phone_mobile',
            content: [
              {
                name: 'phone_mobile',
                type: 'link',
                href: 'phone',
                value: '+380978107725'
              },
              {
                name: 'email',
                type: 'link',
                href: 'email',
                value: 'test.testovich@gmail.com'
              },
              {
                name: 'last_name',
                type: 'link',
                href: 'login',
                value: 'Testovich'
              }
            ],
            contextMenu: undefined
          }
        ]
      }];
      let result = comp.prepareData(config, data);
      expect(result).toEqual(body);
    }));

  });

});
