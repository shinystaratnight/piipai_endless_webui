import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ListImageComponent } from './list-image.copmonent';

describe('ListImageComponent', () => {
  let fixture: ComponentFixture<ListImageComponent>;
  let comp: ListImageComponent;
  let el;
  let config = {
    key: 'gender',
    name: 'gender',
    type: 'icon',
    value: 'male',
    values: {
      female: 'venus',
      male: 'mars'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListImageComponent
      ],
      providers: [],
      imports: [],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ListImageComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter the assertion', async() => {
    expect(comp).toBeDefined();
  });

  describe('ngOnInit method', () => {
    it('should update property icon', () => {
      comp.config = config;
      comp.ngOnInit();
      expect(comp.icon).toEqual(comp.config.values[config.value]);
    });

    it('should update src property', () => {
      config.type = 'picture';
      config.value = <any> {
        thumb: 'image.jpg'
      };
      comp.config = config;
      comp.ngOnInit();
      expect(comp.src).toEqual(comp.config.value.thumb);
    });

    it('should set default image', ()  => {
      let defaultSrc = '/assets/img/avatar.png';
      config.type = 'picture';
      config.value = <any> {
        thumb: null
      };
      comp.config = config;
      comp.ngOnInit();
      expect(comp.src).toEqual(defaultSrc);
    });
  });

});
