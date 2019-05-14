import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopDisplayComponent } from './top-display.component';

describe('TopDisplayComponent', () => {
  let component: TopDisplayComponent;
  let fixture: ComponentFixture<TopDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
