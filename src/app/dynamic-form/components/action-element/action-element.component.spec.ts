import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { ActionElementComponent } from './action-element.component';

describe('ActionElementComponent', () => {
  let fixture: ComponentFixture<ActionElementComponent>;
  let comp: ActionElementComponent;
  let el;
  let config = {
    label: 'Actions:',
    options: [
      {
        key: 'key of action',
        label: 'label of action',
        confirm: true,
        message: 'confirm message'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActionElementComponent
      ],
      providers: [],
      imports: [ NgbModule.forRoot(), FormsModule ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ActionElementComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter the assertion', async() => {
    comp.config = config;
    fixture.detectChanges();
    expect(comp.config).toBeDefined();
  });

  describe('toDoAction method', () => {

    it('should be called open', async(() => {
      spyOn(comp, 'open');
      comp.toDoAction();
      expect(comp.open).toHaveBeenCalled();
    }));

  });

});
