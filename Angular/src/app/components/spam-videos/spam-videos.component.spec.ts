import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpamVideosComponent } from './spam-videos.component';

describe('SpamVideosComponent', () => {
  let component: SpamVideosComponent;
  let fixture: ComponentFixture<SpamVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpamVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpamVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
