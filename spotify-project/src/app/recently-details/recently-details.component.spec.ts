import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyDetailsComponent } from './recently-details.component';

describe('RecentlyDetailsComponent', () => {
  let component: RecentlyDetailsComponent;
  let fixture: ComponentFixture<RecentlyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentlyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
