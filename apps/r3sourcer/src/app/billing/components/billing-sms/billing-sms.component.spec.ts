import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSmsComponent } from './billing-sms.component';

describe('BillingSmsComponent', () => {
  let component: BillingSmsComponent;
  let fixture: ComponentFixture<BillingSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
