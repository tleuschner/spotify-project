import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackAnalysisComponent } from './track-analysis.component';

describe('TrackAnalysisComponent', () => {
  let component: TrackAnalysisComponent;
  let fixture: ComponentFixture<TrackAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
