import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidVideoComponent } from './paid-video.component';

describe('PaidVideoComponent', () => {
  let component: PaidVideoComponent;
  let fixture: ComponentFixture<PaidVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
