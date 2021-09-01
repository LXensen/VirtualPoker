import { Component, OnInit } from '@angular/core';
import {  NavigationStart, Router } from '@angular/router';
import { slideTransition } from './route-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ slideTransition]
})
export class AppComponent implements OnInit {
  isDesktop = true;

  title = 'Stonebridge Poker  ';

  constructor(private router: Router) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart){
        event['url'] === '/mobile' ? this.isDesktop = false : this.isDesktop = true;
        console.log(event['url'] + ' ' + this.isDesktop);
      }
    });

  }
  ngOnInit() {

  }
}
