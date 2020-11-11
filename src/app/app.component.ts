import { Component } from '@angular/core';
import { slideTransition } from './route-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ slideTransition]
})
export class AppComponent {
  title = 'PokerV4';
}
