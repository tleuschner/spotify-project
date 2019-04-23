import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPlaylistsComponent } from './top-playlists.component';

describe('TopPlaylistsComponent', () => {
  let component: TopPlaylistsComponent;
  let fixture: ComponentFixture<TopPlaylistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopPlaylistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopPlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
