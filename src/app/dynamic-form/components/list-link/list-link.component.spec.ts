import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ListLinkComponent } from './list-link.component';

describe('FormSelectComponent', () => {
  let fixture: ComponentFixture<ListLinkComponent>;
  let comp: ListLinkComponent;
  let el;
  let config = {
    href: 'phone',
    name: 'phone_mobile',
    type: 'link'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListLinkComponent
      ],
      providers: [],
      imports: [],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ListLinkComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter the assertion', async() => {
    comp.config = config;
    fixture.detectChanges();
    expect(comp.config).toBeDefined();
  });

  describe('ngOnInit method', () => {

    it('should called createHref method', async(() => {
      comp.config = config;
      spyOn(comp, 'createHref');
      comp.ngOnInit();
      expect(comp.createHref).toHaveBeenCalled();
    }));

  });

  describe('isEmail method', () => {

    it('should parse email', async(() => {
      let email = 'test@test.com';
      expect(comp.isEmail(email)).toBeTruthy();
      email = 'asdasdasdas';
      expect(comp.isEmail(email)).toBeFalsy();
    }));

  });

  describe('isPhone method', () => {

    it('should parse phone number', async(() => {
      let phone = '+380978107785';
      expect(comp.isPhone(phone)).toBeTruthy();
      phone = 'asdasdasdas';
      expect(comp.isPhone(phone)).toBeFalsy();
    }));

  });

  describe('createHref method', () => {

    it('should return link', () => {
      let value = '+380978107785';
      let phone = 'tel:+380978107785';
      let email = 'mailto:test@test.com';
      let resultPhone = comp.createHref(value, phone);
      let resultEmail = comp.createHref(value, email);
      expect(resultPhone).toEqual(phone);
      expect(resultEmail).toEqual(email);
    });

    it('should update link property', () => {
      let link = '/login';
      let result = comp.createHref('', link);
      expect(result).toEqual(link);
    });

  });

  describe('action method', () => {
    it('should emit event', () => {
      comp.config = config;
      let event = {
        preventDefault() {
          return true;
        },
        stopPropagation() {
          return true;
        }
      };
      spyOn(comp.event, 'emit');
      comp.action(event);
      expect(comp.event.emit).toHaveBeenCalled();
    });
  });

  describe('eventHandler method', () => {
    it('should emit event', () => {
      comp.config = config;
      let event = {};
      spyOn(comp.event, 'emit');
      comp.eventHandler(event);
      expect(comp.event.emit).toHaveBeenCalled();
    });
  });

  describe('buttonHandler method', () => {
    it('should emit buttonAction', () => {
      comp.config = config;
      let event = {};
      spyOn(comp.buttonAction, 'emit');
      comp.buttonHandler(event);
      expect(comp.buttonAction.emit).toHaveBeenCalled();
    });
  });

});
