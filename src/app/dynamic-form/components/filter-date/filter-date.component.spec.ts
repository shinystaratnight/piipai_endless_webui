import { FilterService } from './../../services/filter.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';

import { FilterDateComponent } from './filter-date.component';

describe('FilterDateComponent', () => {
  let fixture: ComponentFixture<FilterDateComponent>;
  let comp: FilterDateComponent;
  let el;
  let config = {
    type: 'date',
    key: 'key of filter',
    label: 'Date',
    listName: 'company',
    list: [
      {
        label: 'Today',
        query: 'updated_at_from=03/03/2017'
      },
      {
        label: 'Last week',
        query: 'updated_at__from=01/03/2017&updated_at__to=08/03/2017'
      },
      {
        label: 'Last month',
        query: 'updated_at__from=01/03/2017&updated_ad__to=01/04/2017'
      }
    ],
    input: [
      {
        query: 'updated_at__from',
        label: 'From date'
      },
      {
        query: 'updated_at__to',
        label: 'To date'
      }
    ]
  };
  let queries = {};
  let mockFilterService = {
    generateQuery() {
      return true;
    },
    getQueries() {
      return queries;
    }
  };
  let moment = require('moment');

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterDateComponent
      ],
      providers: [{provide: FilterService, useValue: mockFilterService}],
      imports: [ NgbModule.forRoot(), FormsModule, RouterTestingModule ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FilterDateComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter the assertion', async() => {
    comp.config = config;
    fixture.detectChanges();
    expect(comp.config).toBeDefined();
  });

  describe('ngOnInit method', () => {

    it('should be called updateConfig method', () => {
      queries = {
        data: {
          from: {
            year: 2017,
            month: 4,
            day: 12
          },
          to: {
            year: 2017,
            month: 4,
            day: 19
          }
        },
        query: 'from=01/03/2017&to=08/03/2017'
      };
      comp.config = config;
      spyOn(comp, 'updateConfig');
      spyOn(comp, 'createInputs');
      comp.ngOnInit();
      expect(comp.data).toEqual(queries['data']);
      expect(comp.query).toEqual(queries['query']);
      expect(comp.updateConfig).toHaveBeenCalled();
      expect(comp.createInputs).toHaveBeenCalled();
    });

    it('should update datapicker by date from URL query', async(() => {
      queries = {
        byQuery: true,
        query: 'from=2017-01-03&to=2017-03-08'
      };
      comp.config = config;
      spyOn(comp, 'parseDate');
      comp.ngOnInit();
      expect(comp.query).toEqual(queries['query']);
      expect(comp.picker).toBeTruthy();
    }));

  });

  describe('selectQuery method', () => {

    it('should be called generateQuery method',
      async(inject([FilterService], (fs: FilterService) => {
        comp.config = config;
        let query = '?from=10-03-17';
        spyOn(fs, 'generateQuery');
        spyOn(comp, 'parseDate');
        comp.selectQuery(query);
        expect(fs.generateQuery).toHaveBeenCalled();
        expect(comp.parseDate).toHaveBeenCalled();
        expect(comp.query).toEqual(query);
        expect(comp.picker).toBeFalsy();
    })));

  });

  describe('onChange method', () => {

    it('should be called generateQuery method',
      async(inject([FilterService], (fs: FilterService) => {
        comp.config = config;
        let data = {
          from: '20-03-17',
          to: '30-03-17'
        };
        comp.data = data;
        comp.moment = moment;
        spyOn(fs, 'generateQuery');
        spyOn(comp, 'changeQuery');
        comp.onChange();
        expect(comp.picker).toBeTruthy();
        expect(comp.query).toEqual('');
        expect(fs.generateQuery).toHaveBeenCalled();
        expect(comp.changeQuery).toHaveBeenCalled();
    })));

  });

  describe('updateConfig method', () => {

    it('should update config', () => {
      let to = '30-03-17';
      let from = '10-03-17';
      let result = [
        {
          query: 'updated_at_0',
          label: 'From date',
          maxDate: to
        },
        {
          query: 'updated_at_1',
          label: 'To date',
          minDate: from
        }
      ];
      comp.config = config;
      comp.data = {
        updated_at_1: to,
        updated_at_0: from
      };
      comp.updateConfig();
      expect(comp.config.input).toEqual(result);
    });

  });

  describe('changeQuery method', () => {

    it('should emit event', () => {
      comp.config = config;
      spyOn(comp.event, 'emit');
      comp.changeQuery();
      expect(comp.event.emit).toHaveBeenCalled();
    });

  });

  describe('parseDate method', () => {

    it('should parse date form query', () => {
      let query = 'from=2017-01-03&to=2017-01-15';
      let result: any = {
        from: {
          year: 2017,
          month: 1,
          day: 3
        },
        to: {
          year: 2017,
          month: 1,
          day: 15
        }
      };
      comp.config = config;
      comp.dateFormat = 'YYYY-MM-DD';
      comp.parseDate(query, moment);
      expect(comp.data).toEqual(result);
    });

  });

  describe('createInputs method', () => {

    it('should create inputs data', async() => {
      let data = {};
      comp.config = config;
      comp.createInputs(config.input, data);
      expect(data[config.input[0].query]).toEqual('');
      expect(data[config.input[1].query]).toEqual('');
    });

  });

  describe('resetData method', () => {

    it('should reset data of inputs', async() => {
      let data = {
        from: '01/01/2017',
        to: '01/01/2017'
      };
      comp.config = config;
      comp.resetData(data);
      expect(data.from).toEqual('');
      expect(data.to).toEqual('');
    });

  });

  describe('resetFilter method', () => {

    it('should reset query', async(inject([FilterService], (fs: FilterService) => {
      let data = {
        from: '01/01/2017',
        to: '01/01/2017'
      };
      comp.config = config;
      comp.data = data;
      spyOn(fs, 'generateQuery');
      spyOn(comp, 'changeQuery');
      comp.resetFilter();
      expect(comp.changeQuery).toHaveBeenCalled();
      expect(fs.generateQuery).toHaveBeenCalled();
      expect(comp.query).toBeNull();
      expect(comp.data['from']).toEqual('');
      expect(comp.data['to']).toEqual('');
      expect(comp.picker).toBeFalsy();
    })));

  });

});
