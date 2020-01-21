import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayPerViewComponent } from './pay-per-view.component';

describe('PayPerViewComponent', () => {
  let component: PayPerViewComponent;
  let fixture: ComponentFixture<PayPerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayPerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayPerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
