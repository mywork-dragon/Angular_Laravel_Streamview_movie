import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyVideoComponent } from './easy-video.component';

describe('EasyVideoComponent', () => {
  let component: EasyVideoComponent;
  let fixture: ComponentFixture<EasyVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EasyVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EasyVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
