import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  navOpen = false;

  constructor() { }

  ngOnInit() {
  }

  toggleNavBar() {
    if (!this.navOpen) {
      document.getElementById('nav-container').style.width = "250px";
    } else {
      document.getElementById('nav-container').style.width = "0%";
    }
    this.navOpen = !this.navOpen;
  }

}