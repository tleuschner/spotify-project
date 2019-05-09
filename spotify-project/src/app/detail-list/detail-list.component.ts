import {Component, Input, OnInit} from '@angular/core';
import {DetailObject} from "../models/DetailObject";

@Component({
  selector: 'app-detail-list',
  templateUrl: './detail-list.component.html',
  styleUrls: ['./detail-list.component.css']
})
export class DetailListComponent implements OnInit {
@Input() detailObject: DetailObject;

  constructor() { }

  ngOnInit() {
    console.log(this.detailObject);
  }

}
