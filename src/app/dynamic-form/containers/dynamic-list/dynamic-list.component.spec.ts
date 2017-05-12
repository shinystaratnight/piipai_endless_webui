import { FilterService } from './../../services/filter.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DynamicListComponent } from './dynamic-list.component';

describe('DynamicListComponent', () => {
  let fixture: ComponentFixture<DynamicListComponent>;
  let comp: DynamicListComponent;
  let el;
  let config = {
    list: {
      list: 'company',
      columns: [
        {
          name: 'first_name',
          label: 'First Name',
          sort: true,
          sorted: 'asc',
          content: [
            {
              field: 'first_name',
              type: 'text',
            }
          ],
          context_menu: [
            {
              label: 'edit profile',
              endpoint: 'endpoint'
            }
          ]
        },
        {
          name: 'phone_mobile',
          label: 'Mobile Phone',
          sort: true,
          sorted: 'desc',
          content: [
            {
              field: 'phone_mobile',
              type: 'link',
              link: 'tel:{phone_mobile}'
            },
            {
              field: 'email',
              type: 'link',
              link: 'mailto:{email}'
            },
            {
              field: 'last_name',
              type: 'link',
              endpoint: '/ecore/api/v2/contacts/{id}',
            }
          ],
          context_menu: [
            {
              label: 'send SMS',
              endpoint: 'endpoint'
            }
          ]
        }
      ]
    }
  };

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

  let mockFilterService = {
    _filters: [],
    set filters(value) {
      this._filters = data;
    },
    get filters() {
      return this._filters;
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DynamicListComponent
      ],
      providers: [{provide: FilterService, useValue: mockFilterService}],
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

    it('should called prepareData method', async(() => {
      comp.config = config;
      comp.ngOnInit();
      expect(comp.sortedColumns).toEqual({});
    }));

  });

  describe('ngOnChanges method', () => {

    it('should called prepareData method', async(() => {
      comp.config = config;
      comp.data = data;
      spyOn(comp, 'prepareData');
      spyOn(comp, 'resetSelectedElements');
      spyOn(comp, 'getSortedColumns');
      comp.ngOnChanges();
      expect(comp.prepareData).toHaveBeenCalled();
      expect(comp.resetSelectedElements).toHaveBeenCalled();
      expect(comp.getSortedColumns).toHaveBeenCalled();
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
                value: 'Test'
              }
            ],
            contextMenu: [
              {
                label: 'edit profile',
                endpoint: 'endpoint'
              }
            ]
          },
          {
            name: 'phone_mobile',
            content: [
              {
                name: 'phone_mobile',
                type: 'link',
                link: 'tel:+380978107725',
                value: '+380978107725'
              },
              {
                name: 'email',
                type: 'link',
                link: 'mailto:test.testovich@gmail.com',
                value: 'test.testovich@gmail.com'
              },
              {
                name: 'last_name',
                type: 'link',
                endpoint: '/ecore/api/v2/contacts/8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
                value: 'Testovich'
              }
            ],
            contextMenu: [
              {
                label: 'send SMS',
                endpoint: 'endpoint'
              }
            ]
          }
        ]
      }];
      let result = comp.prepareData(config.list.columns, data);
      expect(result).toEqual(body);
    }));

  });

  describe('getSortedColumns method', () => {

    it('should return object with sorted columns', async(() => {
      let result = {
        first_name: 'asc',
        phone_mobile: 'desc'
      };
      expect(comp.getSortedColumns(config.list.columns)).toEqual(result);
    }));

  });

  describe('sorting method', () => {

    it('should change sorted columns', async(() => {
      let sortedCol = {};
      let field;
      comp.config = config;
      comp.sortedColumns = sortedCol;
      spyOn(comp.event, 'emit');
      field = {
        name: 'first_name',
        sorted: 'asc'
      };
      comp.sorting(field);
      expect(comp.sortedColumns).toEqual({first_name: 'desc'});
      expect(field.sorted).toEqual('desc');
      comp.sorting(field);
      expect(comp.sortedColumns).toEqual({first_name: 'asc'});
      expect(field.sorted).toEqual('asc');
      expect(comp.event.emit).toHaveBeenCalled();
    }));

  });

  describe('resetSort method', () => {

    it('should reset sort query', async(() => {
      let sortedCol = {};
      let field;
      comp.config = config;
      comp.sortedColumns = sortedCol;
      spyOn(comp.event, 'emit');
      field = {
        name: 'first_name',
        sorted: 'asc'
      };
      comp.sorting(field);
      comp.resetSort(field);
      expect(comp.sortedColumns).toEqual({});
      expect(field.sorted).toBeUndefined();
      expect(comp.event.emit).toHaveBeenCalled();
    }));

  });

  describe('setValue method', () => {

    it('should set value from data', async(() => {
      let props = 'primary_contact.contact.__str__'.split('.');
      let values = {
        primary_contact: {
          contact: {
            __str__: 'Mr. Test Testovich'
          }
        },
        name: 'Home LTD'
      };
      let resultOne = {};
      let resultTwo = {};
      comp.setValue(values, props, resultOne);
      comp.setValue(values, ['name'], resultTwo);
      expect(resultOne['value']).toEqual('Mr. Test Testovich');
      expect(resultTwo['value']).toEqual('Home LTD');
    }));

  });

  describe('selectAll method', () => {

    it('should selected all items on list', async(() => {
      let select = {
        123: true,
        124: false
      };
      comp.select = select;
      comp.selectedAll = true;
      comp.selectAll();
      expect(comp.select[123]).toBeTruthy();
      expect(comp.select[124]).toBeTruthy();
      comp.selectedAll = false;
      comp.selectAll();
      expect(comp.select[123]).toBeFalsy();
      expect(comp.select[124]).toBeFalsy();
    }));

  });

  describe('resetSelectedElements method', () => {

    it('should reset all selected elements', async(() => {
      let value = [
        { id: 123 },
        { id: 124 },
      ];
      let select = {
        123: false,
        124: false
      };
      comp.select = comp.resetSelectedElements(value);
      expect(comp.select).toEqual(select);
    }));

  });

  describe('actionHandler method', () => {

    it('should emit new action', async(() => {
      let event = {
        confirm: true,
        key: 'key of action',
        label: 'label of action',
        message: 'confirm message',
        query: 'delete'
      };
      comp.config = config;
      spyOn(comp.event, 'emit');
      comp.actionHandler(event);
      expect(comp.event.emit).toHaveBeenCalled();
    }));

  });

  describe('filterHandler method', () => {

    it('should emit new filter', async(() => {
      let event = {
        list: 'company'
      };
      comp.config = config;
      spyOn(comp.event, 'emit');
      comp.filterHandler(event);
      expect(comp.event.emit).toHaveBeenCalled();
    }));

  });

});
