import { Component, OnInit, Input } from '@angular/core';
import { PodiumObject } from '../models/PodiumObject';

@Component({
  selector: 'app-top-display',
  templateUrl: './top-display.component.html',
  styleUrls: ['./top-display.component.css']
})
export class TopDisplayComponent implements OnInit {
  @Input() isMobile: Boolean;
  @Input() podiumObject: PodiumObject[];
  @Input() routing: string;
  @Input() title: string;
  @Input() isDetail?: boolean;

  constructor() { }

  ngOnInit() {
  }

}
