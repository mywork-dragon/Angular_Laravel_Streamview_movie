import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastCrewsComponent } from './cast-crews.component';

describe('CastCrewsComponent', () => {
  let component: CastCrewsComponent;
  let fixture: ComponentFixture<CastCrewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CastCrewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastCrewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
