import { FilterService } from './../../services/filter.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

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
        query: 'created_at=20-03-17'
      },
      {
        label: 'Last week',
        query: 'from=20-03-17&to=27-03-17'
      },
      {
        label: 'Last month',
        query: 'from=20-03-17&to=20-04-17'
      }
    ],
    input: [
      {
        query: 'from',
        label: 'From date'
      },
      {
        query: 'to',
        label: 'To date'
      }
    ]
  };
  let mockFilterService = {
    generateQuery() {
      return true;
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterDateComponent
      ],
      providers: [{provide: FilterService, useValue: mockFilterService}],
      imports: [ NgbModule.forRoot(), FormsModule ],
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
      spyOn(comp, 'updateConfig');
      comp.ngOnInit();
      expect(comp.updateConfig).toHaveBeenCalled();
    });

  });

  describe('selectQuery method', () => {

    it('should be called updateConfig method',
      async(inject([FilterService], (fs: FilterService) => {
        comp.config = config;
        let query = '?from=10-03-17';
        spyOn(fs, 'generateQuery');
        comp.selectQuery(query);
        expect(fs.generateQuery).toHaveBeenCalled();
        expect(comp.query).toEqual(query);
    })));

  });

  describe('onChange method', () => {

    it('should be called updateConfig method',
      async(inject([FilterService], (fs: FilterService) => {
        comp.config = config;
        let data = {
          from: '20-03-17',
          to: '30-03-17'
        };
        comp.data = data;
        let query = '?from=10-03-17';
        spyOn(fs, 'generateQuery');
        comp.selectQuery(query);
        expect(fs.generateQuery).toHaveBeenCalled();
        expect(comp.query).toEqual(query);
    })));

  });

  describe('updateConfig method', () => {

    it('should update config', () => {
      let to = '30-03-17';
      let from = '10-03-17';
      let result = [
        {
          query: 'from',
          label: 'From date',
          maxDate: to
        },
        {
          query: 'to',
          label: 'To date',
          minDate: from
        }
      ];
      comp.config = config;
      comp.data = { to, from };
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

});
