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
      highlight: {
        values: {
          master: true
        },
        field: 'company.type'
      },
      tabs: [
        {
          label: 'Contact',
          fields: ['gender', 'phone_modile'],
          is_collapsed: false
        },
        {
          label: 'Branch',
          fields: ['branch'],
          is_collapsed: true
        }
      ],
      columns: [
        {
          name: 'first_name',
          sort_field: 'first_name',
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
          sort_field: 'branch',
          label: 'Branch',
          sort: true,
          sorted: 'asc',
          values: {},
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
              icon: 'fa-glob',
              text: '{company.type}'
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
          sort_field: 'phone_mobile',
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
        company: {
          type: 'master'
        },
        id: '8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
        __str__: 'Test Testovich'
    }]
  };
  let query;
  let filters;
  let mockFilterService = {
    _filters: [],
    set filters(value) {
      this._filters = data;
    },
    get filters() {
      return this._filters;
    },
    getQuery(list) {
      return query;
    },
    getFiltersOfList() {
      return filters;
    },
    resetQueries() {
      return true;
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

    it('should init innerTableCall property', async(() => {
      comp.config = config;
      comp.ngOnInit();
      expect(comp.innerTableCall).toEqual({
        row: '',
        cell: ''
      });
    }));

  });

  describe('ngOnChanges method', () => {

    it('should called prepareData method', async(() => {
      comp.config = config;
      comp.data = data;
      comp.maximize = true;
      spyOn(comp, 'prepareData');
      spyOn(comp, 'resetSelectedElements');
      spyOn(comp, 'getSortedColumns');
      spyOn(comp, 'unpopedTable');
      spyOn(comp, 'updateMetadataByTabs');
      comp.ngOnChanges();
      expect(comp.prepareData).toHaveBeenCalled();
      expect(comp.resetSelectedElements).toHaveBeenCalled();
      expect(comp.getSortedColumns).toHaveBeenCalled();
      expect(comp.unpopedTable).toHaveBeenCalled();
      expect(comp.updateMetadataByTabs).toHaveBeenCalled();
    }));

    it('should update datatable', async(() => {
      comp.config = config;
      comp.data = {};
      comp.active = false;
      comp.id = 5;
      spyOn(comp, 'initPagination');
      spyOn(comp, 'updateMetadataByTabs');
      comp.ngOnChanges();
      expect(+comp.datatable.nativeElement.style.zIndex).toEqual(25);
      comp.active = true;
      comp.ngOnChanges();
      expect(+comp.datatable.nativeElement.style.zIndex).toEqual(100);
      expect(comp.updateMetadataByTabs).toHaveBeenCalled();
    }));

    it('should call updateSort method', async(() => {
      comp.config = config;
      comp.data = {};
      comp.active = false;
      comp.id = 5;
      comp.sorted = {
        'company.name': 'asc'
      };
      spyOn(comp, 'updateSort');
      spyOn(comp, 'resetSort');
      spyOn(comp, 'initPagination');
      spyOn(comp, 'updateMetadataByTabs');
      comp.ngOnChanges();
      expect(comp.sortedColumns).toEqual(comp.sorted);
      expect(comp.updateSort).toHaveBeenCalled();
      comp.sorted = {};
      comp.ngOnChanges();
      expect(comp.resetSort).toHaveBeenCalled();
      expect(comp.updateMetadataByTabs).toHaveBeenCalled();
    }));

    it('should create body for inner tables', async(() => {
      comp.innerTableCall = {
        row: 125,
        cell: 'diff'
      };
      comp.config = config;
      let tables = {
        125: {
          diff: {
            metadata: {
              list: {
                columns: []
              }
            },
            data: {
              results: []
            },
            body: {}
          }
        }
      };
      comp.innerTables = tables;
      comp.data = {};
      spyOn(comp, 'prepareData');
      spyOn(comp, 'initPagination');
      spyOn(comp, 'updateMetadataByTabs');
      comp.ngOnChanges();
      expect(comp.prepareData).toHaveBeenCalled();
      expect(comp.updateMetadataByTabs).toHaveBeenCalled();
    }));

  });

  describe('ngOnDestroy', () => {
    it('should clean filters and close modal',
      async(inject([FilterService], (fs: FilterService) => {
        comp.first = true;
        comp.config = config;
        comp.modalRef = {
          close() {
            return true;
          }
        };
        spyOn(comp.modalRef, 'close');
        comp.ngOnDestroy();
        expect(fs.filters).toEqual(null);
        expect(comp.modalRef.close).toHaveBeenCalled();
    })));
  });

  describe('changeTab method', () => {
    it('should not change status of tab', () => {
      comp.tabs = config.list.tabs;
      let tab = comp.tabs[0];
      comp.changeTab(tab);
      expect(tab.is_collapsed).toBeFalsy();
    });

    it('should change status of tab', () => {
      comp.tabs = config.list.tabs;
      let tab = comp.tabs[1];
      comp.changeTab(tab);
      expect(tab.is_collapsed).toBeFalsy();
    });
  });

  describe('getTabOfColumn method', () => {
    it('should return tab of tabs by name of column', () => {
      comp.tabs = config.list.tabs;
      let name = 'gender';
      let tab = comp.getTabOfColumn(name);
      expect(tab).toEqual(comp.tabs[0]);
    });
  });

  describe('updateMetadataByTabs method', () => {
    it('should add tab proporty for all column', () => {
      comp.config = config;
      spyOn(comp, 'getTabOfColumn');
      comp.updateMetadataByTabs(comp.config.list.columns);
      expect(comp.getTabOfColumn).toHaveBeenCalledTimes(4);
    });
  });

  describe('prepareData method', () => {

    it('should prepare data for body', async(() => {
      comp.config = config;
      comp.tabs = config.list.tabs;
      let body = [{
        id: '8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
        __str__: 'Test Testovich',
        highlight: {
          highlight: true
        },
        content: [
          {
            id: '8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
            label: 'First Name',
            name: 'first_name',
            tab: undefined,
            content: [
              {
                rowId: '8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
                key: 'first_name',
                name: 'first_name',
                type: 'text',
                value: 'Test',
                values: undefined
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
            id: '8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
            label: 'Branch',
            name: 'branch',
            tab: undefined,
            content: [
              {
                rowId: '8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
                key: 'branch',
                name: undefined,
                type: 'button',
                values: undefined,
                templateOptions: {
                  label: undefined,
                  icon: 'glob',
                  small: true,
                  mb: false,
                  action: 'openMap',
                  text: 'master',
                  p: true
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
            ],
            contextMenu: undefined
          },
          {
            id: '8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
            label: 'Gender',
            name: 'gender',
            tab: undefined,
            content: [
              {
                rowId: '8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
                key: 'gender',
                name: 'gender',
                type: 'text',
                value: null,
                values: undefined,
              }
            ]
          },
          {
            id: '8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
            label: 'Mobile Phone',
            name: 'phone_mobile',
            tab: undefined,
            content: [
              {
                rowId: '8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
                key: 'phone_mobile',
                name: 'phone_mobile',
                type: 'link',
                link: 'tel:+380978107725',
                value: '+380978107725',
                values: undefined,
              },
              {
                rowId: '8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
                key: 'phone_mobile',
                name: 'email',
                type: 'link',
                link: 'mailto:test.testovich@gmail.com',
                value: 'test.testovich@gmail.com',
                values: undefined,
              },
              {
                rowId: '8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
                key: 'phone_mobile',
                name: 'last_name',
                type: 'link',
                endpoint: '/ecore/api/v2/contacts/8ffddc8b-058b-4d71-94fb-f95eed60cbf9',
                value: 'Testovich',
                values: undefined,
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
      spyOn(comp, 'getTabOfColumn').and.returnValue(undefined);
      let result = comp.prepareData(config.list.columns, data.results, config.list.highlight);
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
        sort_field: 'first_name',
        sorted: 'asc'
      };
      comp.sorting(field);
      expect(comp.sortedColumns).toEqual({first_name: 'asc'});
      expect(field.sorted).toEqual('asc');
      comp.sorting(field);
      expect(comp.sortedColumns).toEqual({first_name: 'desc'});
      expect(field.sorted).toEqual('desc');
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
      comp.resetSort(field, true);
      expect(comp.sortedColumns).toEqual({});
      expect(field.sorted).toBeUndefined();
      expect(comp.event.emit).toHaveBeenCalled();
    }));

  });

  describe('updateSort method', () => {

    it('should update sort property', async(() => {
      comp.config = config;
      comp.updateSort(comp.config.list.columns, 'first_name', 'asc');
      expect(comp.config.list.columns[0].sorted).toEqual('asc');
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

    it('should set value from data', async(() => {
      let props = 'primary_contact.contact'.split('.');
      let values = {
        primary_contact: {
          contact: {
            __str__: 'Mr. Test Testovich'
          }
        }
      };
      let resultOne = {
        type: 'related'
      };
      comp.setValue(values, props, resultOne);
      expect(resultOne['value']).toEqual('Mr. Test Testovich');
    }));

  });

  describe('checkValue method', () => {

    it('should return true if some value exist', async(() => {
      let obj = {
        value: 'Some value',
        fields: []
      };
      let result = comp.checkValue(obj);
      expect(result).toBeTruthy();
      obj = {
        value: '',
        fields: [
          {
            value: 'Some Value'
          }
        ]
      };
      let resultTwo = comp.checkValue(obj);
      expect(resultTwo).toBeTruthy();
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
      data.count = 1;
      comp.limit = 1;
      comp.offset = 0;
      comp.initPagination(data);
      expect(comp.page).toEqual(1);
      expect(comp.pageSize).toEqual(10);
    }));

    it('should open on page 2', async(() => {
      data.count = 10;
      comp.limit = 2;
      comp.offset = 2;
      comp.initPagination(data);
      expect(comp.page).toEqual(2);
      expect(comp.pageSize).toEqual(50);
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

    it('should change poped property', async(inject([FilterService], (fs: FilterService) => {
      comp.config = config;
      comp.poped = false;
      spyOn(fs, 'getFiltersOfList');
      comp.popedTable();
      expect(comp.poped).toEqual(true);
      expect(fs.getFiltersOfList).toHaveBeenCalled();
    })));

  });

  describe('unpopedTable method', () => {

    it('should unpoped table', async(() => {
      comp.config = config;
      comp.poped = true;
      comp.minimized = true;
      comp.maximize = true;
      comp.unpopedTable();
      expect(comp.poped).toEqual(false);
      expect(comp.minimized).toEqual(false);
      expect(comp.maximize).toEqual(false);
    }));

  });

  describe('minimizeTable method', () => {

    it('should change change minimized property', async(() => {
      comp.config = config;
      comp.minimized = false;
      comp.minimizeTable();
      expect(comp.minimized).toEqual(true);
    }));

    it('should emit event', async(() => {
      comp.config = config;
      spyOn(comp.event, 'emit');
      comp.minimizeTable();
      expect(comp.event.emit).toHaveBeenCalledWith({
        type: 'minimize',
        list: config.list.list
      });
  }));

  });

  describe('closeTable method', () => {

    it('should emit event ofclose table', async(inject([FilterService], (fs: FilterService) => {
      comp.config = config;
      spyOn(comp.event, 'emit');
      spyOn(fs, 'resetQueries');
      comp.closeTable();
      expect(comp.event.emit).toHaveBeenCalled();
      expect(fs.resetQueries).toHaveBeenCalled();
    })));

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
      spyOn(comp, 'openList');
      spyOn(comp, 'openDiff');
      comp.buttonHandler(event);
      expect(comp[event.value]).toHaveBeenCalled();
      event.value = 'openList';
      comp.buttonHandler(event);
      expect(comp[event.value]).toHaveBeenCalled();
      event.value = 'openDiff';
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

  describe('editObject method', () => {
    it('should open modal for edit object', () => {
      let id = '123';
      let label = 'Edit';
      comp.endpoint = 'some edpoint';
      spyOn(comp, 'open');
      comp.editObject(id, label);
      expect(comp.modalInfo).toEqual({
        type: 'form',
        endpoint: comp.endpoint,
        label,
        id
      });
      expect(comp.open).toHaveBeenCalled();
    });
  });

  describe('activeTable method', () => {
    it('should emit event', async(() => {
      comp.poped = true;
      comp.config = config;
      spyOn(comp.event, 'emit');
      comp.activeTable({});
      expect(comp.event.emit).toHaveBeenCalled();
    }));
  });

  describe('addHighlight method', () => {
    it('should added property highlight into row', async(() => {
      let field = config.list.highlight.field;
      let elem = data.results[0];
      let row = {
        highlight: undefined
      };
      let values = config.list.highlight.values;
      comp.addHighlight(field, elem, row, values);
      expect(row.highlight).toBeTruthy();
    }));

    it('should add object with color for highlight', async(() => {
      let field = 'is_available';
      let elem = data.results[0];
      let row = {
        highlight: undefined
      };
      let values = {
        true: 'green'
      };
      comp.addHighlight(field, elem, row, values);
      expect(row.highlight.color).toEqual('green');
    }));
  });

  describe('openList method', () => {

    it('should be defined', async(() => {
      expect(comp.openList).toBeDefined();
    }));

    it('should open new list', async(() => {
      let endpoint = 'some endpoint';
      spyOn(comp.list, 'emit');
      comp.openList(endpoint);
      expect(comp.list.emit).toHaveBeenCalledWith({endpoint});
    }));

  });

  describe('openDiff method', () => {

    it('should be defined', async(() => {
      expect(comp.openList).toBeDefined();
    }));

    it('should open new list', async(() => {
      comp.innerTableCall = {};
      let elem = {
        rowId: '124',
        key: 'diff'
      };
      let endpoint = 'some endpoint';
      comp.config = config;
      spyOn(comp.list, 'emit');
      comp.openDiff(endpoint, elem);
      expect(comp.list.emit).toHaveBeenCalledWith({
        endpoint,
        innerTable: true,
        list: config.list.list,
        key: elem.key,
        row: elem.rowId
      });
    }));

  });

  describe('format method', () => {

    it('should be defined', async(() => {
      expect(comp.format).toBeDefined();
    }));

    it('should return full string', async(() => {
      let dataFromApi = {
        company: {
          name: 'Home LTD'
        }
      };
      let value = 'some string';
      let result = comp.format(value, dataFromApi);
      expect(result).toEqual(value);
    }));

    it('should call getPropValue method', async(() => {
      let dataFromApi = {
        company: {
          name: 'Home LTD'
        }
      };
      let key = 'company.name';
      let value = `full company name {${key}}`;
      spyOn(comp, 'getPropValue').and.returnValue('Home LTD');
      let result = comp.format(value, dataFromApi);
      expect(comp.getPropValue).toHaveBeenCalledWith(dataFromApi, key);
      expect(result).toEqual('full company name Home LTD');
    }));

  });

  describe('getPropValue method', () => {

    it('should be defined', async(() => {
      expect(comp.getPropValue).toBeDefined();
    }));

    it('should parse data by key', async(() => {
      let dataFromApi = {
        company: {
          name: 'Home LTD'
        }
      };
      let key = 'company.name';
      let result = comp.getPropValue(dataFromApi, key);
      expect(result).toEqual(dataFromApi.company.name);
    }));

  });

});
