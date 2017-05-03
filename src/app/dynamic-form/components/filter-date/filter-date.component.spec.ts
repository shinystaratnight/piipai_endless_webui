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
    query: ['from', 'to']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterDateComponent
      ],
      providers: [],
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

});
