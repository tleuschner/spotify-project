import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-top-genres',
  templateUrl: './top-genres.component.html',
  styleUrls: ['./top-genres.component.css']
})
export class TopGenresComponent implements OnInit {
  @Input() isMobile: Boolean;

  constructor() { }

  ngOnInit() {
  }

}
