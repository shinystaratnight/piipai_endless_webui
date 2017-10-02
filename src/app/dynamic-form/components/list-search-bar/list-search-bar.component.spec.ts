import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ListSerachBarComponent } from './list-search-bar.component';

describe('ListLinkComponent', () => {
  let fixture: ComponentFixture<ListSerachBarComponent>;
  let comp: ListSerachBarComponent;
  let el;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListSerachBarComponent
      ],
      providers: [],
      imports: [],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ListSerachBarComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter the assertion', async() => {
    expect(comp).toBeDefined();
  });

});
