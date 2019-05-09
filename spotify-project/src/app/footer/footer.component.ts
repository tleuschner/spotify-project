import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Location} from '@angular/common';
import { VisitorsService } from '../services/visitors.service';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  private visitors$: Observable<number>;

  constructor(
    private _location: Location,
    private visitorsService: VisitorsService,
    private authService: AuthService
    ) { }

    //TODO fix number after first login. wenn das erste mal eingeloggt zählt das noch nicht in besucher rein...
    //Dirty aber klappt
  ngOnInit() {
    this.visitors$ = this.visitorsService.getVisitors();
    setInterval( () => {
      this.visitors$ = this.visitorsService.getVisitors();
    }, 60000);
  }


  goBack() {
    this._location.back();
  }

}
