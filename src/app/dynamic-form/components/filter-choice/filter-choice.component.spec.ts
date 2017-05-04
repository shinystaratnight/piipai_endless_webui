import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FilterService } from './../../services/filter.service';

import { FilterChoiceComponent } from './filter-choice.component';

describe('FilterChoiceComponent', () => {
  let fixture: ComponentFixture<FilterChoiceComponent>;
  let comp: FilterChoiceComponent;
  let el;
  let config = {
    type: 'choice',
    key: 'key of filter',
    label: 'Choice of list',
    query: 'company',
    list: [
      {
        label: 'Text of choice',
        value: 'Home'
      },
      {
        label: 'Text of another choice',
        value: 'Homes'
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
        FilterChoiceComponent
      ],
      providers: [{provide: FilterService, useValue: mockFilterService}],
      imports: [],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FilterChoiceComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter the assertion', async() => {
    comp.config = config;
    fixture.detectChanges();
    expect(comp.config).toBeDefined();
  });

  describe('select method', () => {

    it('should set new query', async(() => {
      let value = 'company=Home';
      comp.select(value);
      expect(comp.query).toEqual(value);
    }));

    it('should unset query', async(() => {
      let value = 'company=Home';
      comp.query = value;
      comp.select(value);
      expect(comp.query).toBeNull();
    }));

    it('should be called generateQuery method',
      async(inject([FilterService], (fs: FilterService) => {
      spyOn(fs, 'generateQuery');
      let value = 'company=Home';
      comp.query = value;
      comp.select(value);
      expect(fs.generateQuery).toHaveBeenCalled();
    })));

  });

});
