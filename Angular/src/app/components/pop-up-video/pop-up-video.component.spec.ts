import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpVideoComponent } from './pop-up-video.component';

describe('PopUpVideoComponent', () => {
  let component: PopUpVideoComponent;
  let fixture: ComponentFixture<PopUpVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopUpVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
