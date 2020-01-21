import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerVideoComponent } from './trailer-video.component';

describe('TrailerVideoComponent', () => {
  let component: TrailerVideoComponent;
  let fixture: ComponentFixture<TrailerVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailerVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
