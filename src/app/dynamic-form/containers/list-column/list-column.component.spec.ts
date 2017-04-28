import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ListColumnComponent } from './list-column.component';

describe('FormSelectComponent', () => {
  let fixture: ComponentFixture<ListColumnComponent>;
  let comp: ListColumnComponent;
  let el;
  let config = {
    href: 'phone',
    name: 'phone_mobile',
    type: 'link'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListColumnComponent
      ],
      providers: [],
      imports: [],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ListColumnComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter the assertion', async() => {
    expect(comp).toBeDefined();
  });

});
