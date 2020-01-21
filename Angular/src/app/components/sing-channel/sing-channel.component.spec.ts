import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingChannelComponent } from './sing-channel.component';

describe('SingChannelComponent', () => {
  let component: SingChannelComponent;
  let fixture: ComponentFixture<SingChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
