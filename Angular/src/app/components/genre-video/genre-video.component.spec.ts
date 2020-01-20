import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreVideoComponent } from './genre-video.component';

describe('GenreVideoComponent', () => {
  let component: GenreVideoComponent;
  let fixture: ComponentFixture<GenreVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenreVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
