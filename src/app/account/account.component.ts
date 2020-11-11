import { GameService } from './../service/game.service';
import { AuthService } from './../service/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Gametemplate } from '../shared/model/gametemplate';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  public games = new Observable<Gametemplate[]>();

  constructor(private router: Router) {
              }

  getUsersGames(){

  }

  ngOnInit(): void {
  }

  CreateGame() {
    this.router.navigate(['newgame']);
  }
}
