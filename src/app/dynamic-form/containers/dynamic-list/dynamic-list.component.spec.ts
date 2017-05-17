import { FilterService } from './../../services/filter.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DynamicListComponent } from './dynamic-list.component';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
          name: 'branch',
          label: 'Branch',
          sort: true,
          sorted: 'asc',
          content: [
            {
              fields: [
                {
                  field: 'address.latitude',
                  type: 'input'
                },
                {
                  field: 'address.longitude',
                  type: 'input'
                }
              ],
              type: 'button',
              action: 'openMap',
              icon: 'fa-glob'
            }
          ]
        },
        {
          name: 'gender',
          label: 'Gender',
          sort: false,
          content: [
            {
              field: 'gender',
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

  let data = {
    count: 4,
    next: '/ecore/api/v2/endless-core/companyaddresses/?limit=1&offset=1',
    results: [{
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
        address: {
          latitude: 12,
          longitude: 13
        },
        id: '8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
    }]
  };

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
      imports: [NgbModule.forRoot()],
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

    it('should called initPagination method', async(() => {
      spyOn(comp, 'initPagination');
      comp.config = config;
      comp.data = {};
      comp.ngOnInit();
      expect(comp.sortedColumns).toEqual({});
      expect(comp.initPagination).toHaveBeenCalled();
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
            name: 'branch',
            content: [
              {
                name: undefined,
                type: 'button',
                templateOptions: {
                  label: undefined,
                  icon: 'glob',
                  small: true,
                  mb: false,
                  action: 'openMap'
                },
                fields: [
                  {
                    field: 'address.latitude',
                    type: 'input',
                    value: 12
                  },
                  {
                    field: 'address.longitude',
                    type: 'input',
                    value: 13
                  }
                ]
              }
            ]
          },
          {
            name: 'gender',
            content: [
              {
                name: 'gender',
                type: 'text',
                value: null
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
      let result = comp.prepareData(config.list.columns, data.results);
      expect(result).toEqual(body);
    }));

  });

  describe('getSortedColumns method', () => {

    it('should return object with sorted columns', async(() => {
      let result = {
        first_name: 'asc',
        phone_mobile: 'desc',
        branch: 'asc'
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
      spyOn(comp, 'sortTable');
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
      expect(comp.sortTable).toHaveBeenCalled();
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

  describe('openModal method', () => {

    it('should be defined', async(() => {
      expect(comp.openModal).toBeDefined();
    }));

    it('should open modal', async(() => {
      let field = {
        label: 'Company',
        endpoint: '/ecore/api/v2/endless-core/companyaddresses',
        type: 'form'
      };
      spyOn(comp, 'open');
      comp.openModal('modal', field);
      expect(comp.open).toHaveBeenCalled();
      expect(comp.modalInfo).toEqual(field);
    }));

  });

  describe('initPagination method', () => {

    it('should be defined', async(() => {
      expect(comp.initPagination).toBeDefined();
    }));

    it('should init pagination properties', async(() => {
      comp.initPagination(data);
      expect(comp.limit).toEqual(1);
      expect(comp.pageSize).toEqual(40);
      data.count = 1;
      data.results.length = 3;
      comp.initPagination(data);
      expect(comp.limit).toEqual(3);
      expect(comp.pageSize).toEqual(10);
    }));

  });

  describe('sortTable method', () => {

    it('should be defined', async(() => {
      expect(comp.sortTable).toBeDefined();
    }));

    it('should create query', async(() => {
      let sort = {
        primary_contact: 'desc'
      };
      let result = comp.sortTable(sort);
      expect(result).toEqual('ordering=-primary_contact');
    }));

  });

  describe('pageChange method', () => {

    it('should be defined', async(() => {
      expect(comp.pageChange).toBeDefined();
    }));

    it('should emit event', async(() => {
      comp.config = config;
      comp.limit = 2;
      comp.page = 2;
      spyOn(comp.event, 'emit');
      comp.pageChange();
      comp.page = 3;
      expect(comp.event.emit).toHaveBeenCalled();
    }));

  });

  describe('popedTable method', () => {

    it('should change poped property', async(() => {
      comp.config = config;
      comp.poped = false;
      comp.popedTable();
      expect(comp.poped).toEqual(true);
      expect(comp.position).toBeDefined();
      expect(comp.datatable.nativeElement.style.position).toEqual('absolute');
    }));

  });

  describe('unpopedTable method', () => {

    it('should unpoped table', async(() => {
      comp.config = config;
      comp.poped = true;
      comp.minimized = true;
      comp.position = {
        top: 10,
        left: 15
      };
      comp.unpopedTable();
      expect(comp.poped).toEqual(false);
      expect(comp.minimized).toEqual(false);
      expect(comp.datatable.nativeElement.style.position).toEqual('relative');
      expect(comp.datatable.nativeElement.style.top).toEqual('0px');
      expect(comp.datatable.nativeElement.style.left).toEqual('0px');
      expect(comp.datatable.offsetTop).toEqual(comp.position.top);
      expect(comp.datatable.offsetLeft).toEqual(comp.position.left);
    }));

  });

  describe('minimizeTable method', () => {

    it('should change change minimized property', async(() => {
      comp.config = config;
      comp.minimized = false;
      comp.minimizeTable();
      expect(comp.minimized).toEqual(true);
      comp.minimizeTable();
      expect(comp.minimized).toEqual(false);
    }));

  });

  describe('buttonHandler method', () => {
    it('should call the function', () => {
      comp.config = config;
      let event = {
        value: 'openMap',
        el: {
          fields: []
        }
      };
      spyOn(comp, 'openMap');
      comp.buttonHandler(event);
      expect(comp[event.value]).toHaveBeenCalled();
    });
  });

  describe('openMap method', () => {
    it('should show map on modal', async(() => {
      spyOn(comp, 'open');
      let value = [
        {
          field: 'address.latitude',
          value: 12
        },
        {
          field: 'address.longitude',
          value: 13
        }
      ];
      let result = {
        type: 'map',
        latitude: 12,
        longitude: 13
      };
      comp.modal = {};
      comp.openMap(value);
      expect(comp.modalInfo).toEqual(result);
      expect(comp.open).toHaveBeenCalled();
    }));
  });

  describe('eventHandler method', () => {
    it('should open modal', async(() => {
      comp.config = config;
      let event = {
        target: 'form',
        endpoint: '/',
        label: 'Modal label',
        id: 'element id'
      };
      let result = {
        type: 'form',
        endpoint: '/',
        label: 'Modal label',
        id: 'element id'
      };
      spyOn(comp, 'open');
      comp.eventHandler(event);
      expect(comp.modalInfo).toEqual(result);
      expect(comp.open).toHaveBeenCalled();
    }));
  });

});
