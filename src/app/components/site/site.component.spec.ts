import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { SiteService, PageData } from '../../services/site.service';

import { SiteComponent } from './site.component';
import { LoginFormComponent } from './login-form.component';

import { Observable } from 'rxjs/Observable';

describe('SiteComponent', () => {

  let comp: SiteComponent;
  let fixture: ComponentFixture<SiteComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let mockUrl: any = ['contact', 'add'];
  let pageData: PageData;

  beforeEach(async(() => {

    const mockSiteService = {
      getDataOfPage() {
        return Observable.of(pageData);
      }
    };

    const mockActivatedRoute = {
      url: Observable.of(mockUrl)
    };

    const mockRouter = {
      navigate() {
        return true;
      }
    };

    TestBed.configureTestingModule({
      declarations: [SiteComponent],
      providers: [
        LocalStorageService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: SiteService, useValue: mockSiteService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SiteComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });

  describe('ngOnInit method', () => {
    it('should update pageData property',
      fakeAsync(inject([LocalStorageService, SiteService],
        (storage: LocalStorageService, siteService: SiteService) => {
          let user = {id: 2};
          pageData = {
            endpoint: '/ecore/api/v2/contacts/',
            pathData: {
              type: 'form',
              path: '/contact/',
              id: '123'
            }
          };
          storage.store('contact', user);
          comp.ngOnInit();
          tick(100);
          expect(comp.pageData).toEqual(pageData);
          expect(comp.user).toEqual(user);
          expect(comp.dashboard).toBeFalsy();
          storage.clear('contact');
        })));
  });

  describe('formEvent method', () => {
    it('should redirect to list page', async(inject([Router], (router: Router) => {
      let event = {
        type: 'sendForm',
        status: 'success'
      };
      comp.pageData = {
        endpoint: '/ecore/api/v2/contacts/',
        pathData: {
          type: 'form',
          path: '/contact/',
          id: '123'
        }
      };
      spyOn(router, 'navigate');
      comp.formEvent(event);
      expect(router.navigate).toHaveBeenCalledWith([comp.pageData.pathData.path]);
    })));
  });

});
