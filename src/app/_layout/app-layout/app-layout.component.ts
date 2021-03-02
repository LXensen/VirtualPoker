import { Component, OnInit } from '@angular/core';
import { slideTransition } from 'src/app/route-animations';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css'],
  animations: [ slideTransition]
})
export class AppLayoutComponent implements OnInit {

  constructor() {
   }

  ngOnInit(): void {
  }

}
