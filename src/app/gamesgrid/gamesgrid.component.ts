import { GameService } from './../service/game.service';
import { Router } from '@angular/router';
import { AuthService } from './../service/auth.service';
import { Gametemplate } from './../shared/model/gametemplate';
import { Component, OnInit } from '@angular/core';
import { User } from '../shared/model/user';
import { merge, Observable } from 'rxjs';
@Component({
  selector: 'app-gamesgrid',
  templateUrl: './gamesgrid.component.html',
  styleUrls: ['./gamesgrid.component.css']
})
export class GamesgridComponent implements OnInit {
  games: Gametemplate[] = [];
  user: User;
  newgames: Observable<any>;

  constructor(private authService: AuthService,
              private gameService: GameService,
              private router: Router) {

   }

  ngOnInit(): void {
    this.authService.user$.subscribe((usr: any) => {
      // this.user = usr.data();
      debugger;
      this.user = usr;
      this.games = new Array();

      this.gameService.NEWPlayersGames(this.user.uid).subscribe(data => {
        this.games = new Array();
        merge(...data).subscribe((docs: any) => {
          this.games.push(docs.data());
        });
      });
    });
  }

  GoToGame(gameId: string) {
  // set the players active game to this id
      this.gameService.SetPlayersCurrentGame(gameId, this.user).then(() => {
        // update the stack of the player then route
        this.router.navigate(['game/' + gameId]);
      });
  }

  Invites(gameId: string) {
    this.router.navigate(['invites/' + gameId]);
  }
}
