import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.css']
})
export class MobileComponent implements OnInit {

  numberOfPlayers: number[] = new Array(4);

  constructor() {
  
   }

  ngOnInit(): void {
  }

}
