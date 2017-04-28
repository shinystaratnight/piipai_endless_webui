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

    it('should update href with "tel:"', async(() => {
      let value = '+380978107785';
      let result = comp.createHref(value, comp.link);
      expect(result).toEqual('tel:+380978107785');
    }));

    it('should update href with "mailto:"', async(() => {
      let value = 'test@test.com';
      let result = comp.createHref(value, comp.link);
      expect(result).toEqual('mailto:test@test.com');
    }));

    it('should update href with "/"', async(() => {
      let value = 'adasdasd';
      let result = comp.createHref(value, comp.href);
      expect(result).toEqual(`/${comp.href}`);
    }));

  });

});
