import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { VisitorsService } from '../services/visitors.service';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @ViewChild('footer', { read: ElementRef }) footer?: ElementRef;

  public visitors$: Observable<number>;
  public date: string;

  constructor(
    private _location: Location,
    private visitorsService: VisitorsService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.visitors$ = this.visitorsService.getVisitors();
    //update visitors every minute
    setInterval(() => {
      this.visitors$ = this.visitorsService.getVisitors();
    }, 60000);
  }

  goBack() {
    this._location.back();
  }

}
